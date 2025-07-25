import { useState, useEffect, useContext } from 'react';
import { setupAPIClient } from '../../services/api';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';

interface AvailableProductsTableProps {
  purchaseId: string;
  onAddSuccess: () => void;
}

interface Product {
  id: string;
  name: string;
  description: string;
  unit: string;
  isIgredient: boolean;
  isDerived: boolean;
}

export default function AvailableProductsTable({ 
  purchaseId, 
  onAddSuccess 
}: AvailableProductsTableProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    quantity: 1,
    purchasePrice: 0,
    productTypeId: 1,
    marginPercentage: 20
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const apiClient = setupAPIClient();

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/produts');
      const Products = response.data.filter(
        (product: Product) => product.isIgredient === true || product.isDerived === false
      );
      setProducts(Products);
      setFilteredProducts(Products);
    } catch (error) {
      toast.error('Erro ao carregar produtos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
      setCurrentPage(1);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, products]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleAddProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      await apiClient.post('/compra_produt', {
        ...formData,
        purchaseId,
        productId: selectedProduct.id,
        productTypeId: "1"
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      toast.success('Produto adicionado à compra!');
      onAddSuccess();
      setSelectedProduct(null);
      setFormData({
        quantity: 1,
        purchasePrice: 0,
        productTypeId: 0,
        marginPercentage: 20,
      });
    } catch (error) {
      toast.error('Erro ao adicionar produto');
      console.log(error);
    }
  };

  const handleRowClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-16 min-h-[600px] px-4 md:px-8 py-6 bg-slate-800 text-slate-200">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column: Search + Table */}
        <div className="flex-1 space-y-6">
          {!selectedProduct && (
            <div className="text-yellow-400 text-sm px-2 py-2">
              Selecionar um produto para enviar ao stock
            </div>
          )}
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-md leading-5 bg-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Pesquisar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Pagination controls */}
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-300">Itens por página:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="border border-slate-600 rounded-md px-2 py-1 text-sm bg-slate-700 text-slate-200"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
            <div className="text-sm text-slate-300">
              Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} de {filteredProducts.length} itens
            </div>
          </div>

          {/* Table with scroll */}
          <div className="overflow-auto max-h-[400px] border border-slate-700 rounded-md">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-700 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Produto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Descrição</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Unidade</th>
                </tr>
              </thead>
              <tbody className="bg-slate-800 divide-y divide-slate-700">
                {isLoading ? (
                  <tr><td colSpan={4} className="px-6 py-4 text-center text-slate-300">Carregando produtos...</td></tr>
                ) : currentItems.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-4 text-center text-slate-300">{searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto disponível'}</td></tr>
                ) : (
                  currentItems.map((product) => (
                    <tr
                      key={product.id}
                      onClick={() => handleRowClick(product)}
                      className={`cursor-pointer hover:bg-slate-700/50 ${
                        selectedProduct?.id === product.id ? 'bg-blue-900/30' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-200">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{product.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{product.unit}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
            <div className="flex flex-wrap items-center space-x-1">
              <button 
                onClick={() => handlePageChange(1)} 
                disabled={currentPage === 1} 
                className="px-3 py-1 border border-slate-600 rounded disabled:opacity-50 bg-slate-700 text-slate-200 hover:bg-slate-600"
              >
                «
              </button>
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1} 
                className="px-3 py-1 border border-slate-600 rounded disabled:opacity-50 bg-slate-700 text-slate-200 hover:bg-slate-600"
              >
                ‹
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === page 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages} 
                className="px-3 py-1 border border-slate-600 rounded disabled:opacity-50 bg-slate-700 text-slate-200 hover:bg-slate-600"
              >
                ›
              </button>
              <button 
                onClick={() => handlePageChange(totalPages)} 
                disabled={currentPage === totalPages} 
                className="px-3 py-1 border border-slate-600 rounded disabled:opacity-50 bg-slate-700 text-slate-200 hover:bg-slate-600"
              >
                »
              </button>
            </div>
            <div className="text-sm text-slate-300">Página {currentPage} de {totalPages}</div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="w-full md:w-[420px]">
          {selectedProduct && (
            <div className="p-6 bg-slate-700 rounded-lg border border-slate-600 shadow-md">
              <h3 className="text-sm font-semibold mb-4 text-slate-200">
                Adicionar <span className="text-blue-400">{selectedProduct.name}</span> à compra
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-300">Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 border border-slate-600 rounded-md bg-slate-800 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-300">Preço unitário de Compra</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({...formData, purchasePrice: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-slate-600 rounded-md bg-slate-800 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-300">Preço de Venda (auto)</label>
                  <p className="text-xs text-slate-400 mt-1">
                    Calculado: {formData.purchasePrice} + {formData.marginPercentage}% = {formData.purchasePrice} + {formData.marginPercentage}%
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <button 
                  onClick={() => setSelectedProduct(null)} 
                  className="px-4 py-2 border border-slate-600 rounded text-slate-200 hover:bg-slate-600"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleAddProduct} 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Adicionar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}