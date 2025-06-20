import { useContext, useEffect, useState } from 'react';
import { setupAPIClient } from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import CreateModal from './CreateModal';
import { FaPlus, FaSearch, FaEdit, FaList, FaCheck } from 'react-icons/fa';
import { toast } from "react-toastify";
import PurchaseProductModal from './PurchaseProductModal';
import AddToStockButton from './AddToStockButton';

interface Purchase {
  id: string;
  name: string;
  description: string;
  qtdCompra: number;
  organizationId: string;
  supplierId: string;
  status: boolean;
  created_at: string;
}

interface PurchaseListProps {
  refreshKey: number;
}

export default function PurchaseList({ refreshKey }: PurchaseListProps) {
  const { user } = useContext(AuthContext);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'pending'>('all');
  
  const itemsPerPage = 10;
  const apiClient = setupAPIClient();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    qtdCompra: 0,
    supplierId: '1'
  });

  // Contadores para cada tab
  const counts = {
    all: purchases.length,
    completed: purchases.filter(p => p.status).length,
    pending: purchases.filter(p => !p.status).length
  };

  const fetchPurchases = async () => {
    try {
      const response = await apiClient.get('/compra', {
        params: { organizationId: user?.organizationId },
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      
      setPurchases(response.data);
      filterPurchases(response.data, searchTerm, activeTab);
    } catch (error) {
      console.error('Erro ao buscar compras:', error);
      toast.error('Erro ao carregar compras');
    } finally {
      setIsLoading(false);
    }
  };

  const filterPurchases = (purchases: Purchase[], term: string, tab: typeof activeTab) => {
    let filtered = purchases;
    
    // Aplica filtro por termo de busca
    if (term.trim() !== '') {
      filtered = filtered.filter(purchase =>
        purchase.name.toLowerCase().includes(term.toLowerCase()) ||
        purchase.description.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    // Aplica filtro por status
    if (tab === 'completed') {
      filtered = filtered.filter(purchase => purchase.status);
    } else if (tab === 'pending') {
      filtered = filtered.filter(purchase => !purchase.status);
    }
    
    setFilteredPurchases(filtered);
    setCurrentPage(1);
  };

  const handleAddPurchase = async () => {
    try {
      if (!user?.organizationId) {
        toast.error('Organização não identificada');
        return;
      }
      
      const response = await apiClient.post('/compra', {
        ...formData,
        organizationId: user.organizationId
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      setPurchases(prev => [...prev, response.data]);
      filterPurchases([...purchases, response.data], searchTerm, activeTab);
      setShowAddModal(false);
      setFormData({
        name: '',
        description: '',
        qtdCompra: 0,
        supplierId: '1'
      });
      toast.success('Compra adicionada com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar compra:', error);
      toast.error('Erro ao adicionar compra');
    }
  };

  useEffect(() => {
    if (!user || !user.token) {
      setIsLoading(false);
      return;
    }
    fetchPurchases();
  }, [refreshKey, user]);

  useEffect(() => {
    filterPurchases(purchases, searchTerm, activeTab);
  }, [searchTerm, activeTab]);

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPurchases.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar compras..."
              className="pl-10 pr-4 py-2 border rounded-lg w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaPlus /> Adicionar Compra
          </button>
        </div>
      </div>
      
      {/* Tabs de filtro por status */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 font-medium text-sm focus:outline-none flex items-center gap-1 ${
            activeTab === 'all' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Todas <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{counts.all}</span>
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 font-medium text-sm focus:outline-none flex items-center gap-1 ${
            activeTab === 'pending' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Pendentes <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{counts.pending}</span>
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 font-medium text-sm focus:outline-none flex items-center gap-1 ${
            activeTab === 'completed' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Concluídas <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{counts.completed}</span>
        </button>
      </div>
      
      {filteredPurchases.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          {searchTerm 
            ? "Nenhuma compra encontrada com esse termo" 
            : activeTab === 'all'
              ? "Nenhuma compra cadastrada ainda"
              : activeTab === 'pending'
                ? "Nenhuma compra pendente"
                : "Nenhuma compra concluída"}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((purchase) => (
                  <tr key={purchase.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{purchase.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{purchase.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(purchase.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${purchase.status ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {purchase.status ? 'Concluída' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedPurchase(purchase);
                            setShowProductModal(true);
                          }}
                          className={`inline-flex items-center px-3 py-1 rounded-md text-sm 
                            ${purchase.status ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                        >
                          {purchase.status ? <FaList className="mr-1" /> : <FaPlus className="mr-1" />}
                          {purchase.status ? 'Ver Itens' : 'Adicionar Itens'}
                        </button>
                        
                        <AddToStockButton
                          purchaseId={purchase.id}
                          onSuccess={fetchPurchases}
                          status={purchase.status}
                          organizationId={user?.organizationId || ''}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === number 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {number}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </>
      )}
      
      {/* Modal para adicionar compra */}
      <CreateModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Adicionar Nova Compra"
      >
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Nome*</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              placeholder="Ex: Compra para Funge"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              placeholder="Ex: Ingredientes para o funge"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddPurchase}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={!formData.name.trim()}
            >
              Salvar Compra
            </button>
          </div>
        </div>
      </CreateModal>
      
      {/* Modal para produtos da compra */}
      {showProductModal && selectedPurchase && (
        <PurchaseProductModal
          purchaseId={selectedPurchase.id}
          onClose={() => setShowProductModal(false)}
          onSuccess={fetchPurchases}
          status={selectedPurchase.status}
        />
      )}
      
      
    </div>
  );
}