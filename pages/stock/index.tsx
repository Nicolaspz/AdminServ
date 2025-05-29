import React, { useState, useEffect, useContext } from "react";
import { setupAPIClient } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import { FaEye, FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

type Product = {
  id: string;
  name: string;
  price: string;
  description: string;
  quantity: number;
};

export default function Stock() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { user } = useContext(AuthContext);
  const apiClient = setupAPIClient();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.organizationId) return;
   
    async function fetchStock() {
      try {
        const response = await apiClient.get('/stock', {
          params: {
            organizationId: user.organizationId
          },
          headers: { Authorization: `Bearer ${user.token}` }
        });
        console.log(response.data);
        const transformedProducts = response.data.map((item: any) => ({
          id: item.id,
          name: item.product.name,
          price: `${item.price}Kz`,
          description: item.product.description,
          quantity: item.quantity || 0,
        }));
        
        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
        setIsLoading(false);
      } catch (error) {
        console.log("Erro ao buscar estoque:", error);
        setIsLoading(false);
      }
    }
  
    fetchStock();
  }, [user]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
      setCurrentPage(1);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.price.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, products]);

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null)

  const toggleDescription = (productId: string) => {
    setExpandedProductId((prev) => (prev === productId ? null : productId));
  };

  const formatDescription = (desc: string) => {
    return desc.length > 50 ? `${desc.substring(0, 50)}...` : desc;
  };

  return (
    <Sidebar>
      <Header />
      <div className="min-h-screen bg-gray-900 p-5">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Estoque de Produtos</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              className="bg-gray-700 text-white px-4 py-2 rounded-md pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
            <p className="text-white text-lg">Carregando estoque...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex items-center justify-center h-screen">
            <p className="text-white text-lg">
              {searchTerm ? "Nenhum produto encontrado com o termo pesquisado." : "Não há produtos em estoque no momento."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Preço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Quantidade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {currentItems.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap text-white">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">{product.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-400">{product.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {formatDescription(product.description)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleDescription(product.id)}
                        className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                      >
                        <FaEye />
                        {expandedProductId === product.id ? 'Ocultar' : 'Ver'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <div className="text-white">
                Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredProducts.length)} de {filteredProducts.length} itens
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  Próxima
                </button>
              </div>
            </div>

            {/* Description Modal */}
            {expandedProductId && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">
                      {products.find(p => p.id === expandedProductId)?.name}
                    </h3>
                    <button
                      onClick={() => setExpandedProductId(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      &times;
                    </button>
                  </div>
                  <p className="text-white whitespace-pre-line">
                    {products.find(p => p.id === expandedProductId)?.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Sidebar>
  );
}