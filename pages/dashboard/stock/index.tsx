import React, { useState, useEffect, useContext } from "react";
import { setupAPIClient } from "../../../services/api";
import { AuthContext } from "../../../contexts/AuthContext";
import { FiEye, FiChevronDown, FiChevronUp, FiSearch, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";

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
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-slate-200">Gestão de Estoque</h1>
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FiX className="text-slate-400 hover:text-slate-300" />
              </button>
            )}
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-700">
            {filteredProducts.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-slate-400 text-lg mb-2">
                  {searchTerm ? (
                    "Nenhum produto encontrado com o termo pesquisado"
                  ) : (
                    "Nenhum produto cadastrado no estoque"
                  )}
                </div>
                {!searchTerm && (
                  <button className="text-slate-300 hover:text-white font-medium">
                    Adicionar produtos ao estoque
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-700">
                    <thead className="bg-slate-750">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                          Produto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                          Estoque
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                          Preço
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-slate-800 divide-y divide-slate-700">
                      {currentItems.map((product) => (
                        <tr key={product.id} className="hover:bg-slate-750 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${
                              product.quantity <= 4 ? 'text-red-400' : 'text-slate-200'
                            }`}>
                              {product.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.quantity <= 4 
                                ? 'bg-red-900/30 text-red-400' 
                                : 'bg-green-900/30 text-green-400'
                            }`}>
                              {product.quantity} unid.
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                            {product.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => toggleDescription(product.id)}
                              className="text-slate-300 hover:text-white mr-3 flex items-center gap-1.5"
                            >
                              <FiEye className="text-slate-400" />
                              {expandedProductId === product.id ? 'Ocultar' : 'Detalhes'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="bg-slate-750 px-4 py-3 flex items-center justify-between border-t border-slate-700 sm:px-6">
                  <div className="flex-1 flex justify-between sm:justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-400">
                        Mostrando <span className="font-medium text-slate-300">{indexOfFirstItem + 1}</span> a{' '}
                        <span className="font-medium text-slate-300">{Math.min(indexOfLastItem, filteredProducts.length)}</span> de{' '}
                        <span className="font-medium text-slate-300">{filteredProducts.length}</span> itens
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-600 bg-slate-700 text-sm font-medium ${
                            currentPage === 1 ? 'text-slate-500 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          <span className="sr-only">Anterior</span>
                          <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        
                        <div className="hidden md:flex">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  currentPage === pageNum
                                    ? 'z-10 bg-slate-600 border-slate-500 text-white'
                                    : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>
                        
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-600 bg-slate-700 text-sm font-medium ${
                            currentPage === totalPages ? 'text-slate-500 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          <span className="sr-only">Próxima</span>
                          <FiChevronRight className="h-5 w-5" aria-hidden="true" />
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
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 p-6 rounded-lg max-w-2xl w-full border border-slate-700 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-200">
                  {products.find(p => p.id === expandedProductId)?.name}
                </h3>
                <button
                  onClick={() => setExpandedProductId(null)}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-400">Quantidade em estoque:</h4>
                  <p className={`mt-1 text-sm ${
                    products.find(p => p.id === expandedProductId)?.quantity <= 4 
                      ? 'text-red-400' 
                      : 'text-slate-200'
                  }`}>
                    {products.find(p => p.id === expandedProductId)?.quantity} unidades
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-400">Preço:</h4>
                  <p className="mt-1 text-sm text-slate-200">
                    {products.find(p => p.id === expandedProductId)?.price}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-400">Descrição:</h4>
                  <p className="mt-1 text-sm text-slate-300 whitespace-pre-line">
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