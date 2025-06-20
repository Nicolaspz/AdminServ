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
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

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
        
        const transformedProducts = response.data.map((item: any) => ({
          id: item.id,
          name: item.product.name,
          price: `${item.product.price}Kz`,
          description: item.product.description,
          quantity: item.quantity || 0,
        }));
        console.log("stock",response.data)
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

  const toggleDescription = (productId: string) => {
    setExpandedProductId((prev) => (prev === productId ? null : productId));
  };

  return (
    <Sidebar>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Estoque de Produtos</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {filteredProducts.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-500 text-lg mb-2">
                  {searchTerm ? (
                    "Nenhum produto encontrado com o termo pesquisado"
                  ) : (
                    "Nenhum produto cadastrado no estoque"
                  )}
                </div>
                {!searchTerm && (
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    Deve Fazer compra para adicionar ao stock
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantidade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Preço
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${
                              product.quantity <= 4 ? 'text-red-600' : 'text-gray-900'
                            }`}>
                              {product.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.quantity <= 4 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {product.quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => toggleDescription(product.id)}
                              className="text-blue-600 hover:text-blue-900 mr-3 flex items-center gap-1"
                            >
                              <FaEye />
                              {expandedProductId === product.id ? 'Ocultar' : 'Ver'} detalhes
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a{' '}
                        <span className="font-medium">{Math.min(indexOfLastItem, filteredProducts.length)}</span> de{' '}
                        <span className="font-medium">{filteredProducts.length}</span> resultados
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <span className="sr-only">Anterior</span>
                          <FaChevronUp className="h-5 w-5 transform rotate-270" aria-hidden="true" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === page
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <span className="sr-only">Próxima</span>
                          <FaChevronUp className="h-5 w-5 transform rotate-90" aria-hidden="true" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Description Modal */}
        {expandedProductId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {products.find(p => p.id === expandedProductId)?.name}
                </h3>
                <button
                  onClick={() => setExpandedProductId(null)}
                  className="text-gray-400 hover:text-gray-500 text-2xl"
                >
                  &times;
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Quantidade em estoque:</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {products.find(p => p.id === expandedProductId)?.quantity}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Preço:</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {products.find(p => p.id === expandedProductId)?.price}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Descrição completa:</h4>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                    {products.find(p => p.id === expandedProductId)?.description || "Nenhuma descrição disponível"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
}