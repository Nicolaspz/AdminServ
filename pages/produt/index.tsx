import React, { useState, useEffect, useContext } from "react";
import { setupAPIClient } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import { FaEye, FaEdit, FaTrash, FaPlus, FaSearch, FaUtensils } from 'react-icons/fa';
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

type RecipeItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  banner?: string;
  unit: string;
  is_fractional: boolean;
  isDerived: boolean;
  
  recipeItems: RecipeItem[];
};

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const { user } = useContext(AuthContext);
  const apiClient = setupAPIClient();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.organizationId) return;

    async function fetchProducts() {
      try {
        const response = await apiClient.get('/produts', {
          params: {
            organizationId: user.organizationId
          },
          headers: { Authorization: `Bearer ${user.token}` }
        });
        console.log("passou",response.data);
        setProducts(response.data);
        setFilteredProducts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching products:", error);
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [user]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleViewRecipe = (product: Product) => {
    setSelectedProduct(product);
    setShowRecipeModal(true);
  };

  const handleEdit = (productId: string) => {
    // Implementar navegação para edição
    console.log("Edit product:", productId);
  };

  const handleDelete = (productId: string) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete || !user) return;
    
    try {
      await apiClient.delete(`/products/${productToDelete}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      setProducts(products.filter(p => p.id !== productToDelete));
      setFilteredProducts(filteredProducts.filter(p => p.id !== productToDelete));
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Componente Modal interno
  const Modal = ({ 
    isOpen, 
    onClose, 
    title, 
    children 
  }: { 
    isOpen: boolean; 
    onClose: () => void; 
    title: string; 
    children: React.ReactNode 
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
          <div className="flex justify-between items-center border-b border-gray-700 px-6 py-4">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              &times;
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Sidebar>
      <Header />
      <div className="min-h-screen bg-gray-900 p-5">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Lista de Produtos</h1>
          <div className="flex gap-4">
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
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
              onClick={() => console.log("Add new product")}
            >
              <FaPlus /> Adicionar
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
            <p className="text-white text-lg">Carregando produtos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex items-center justify-center h-screen">
            <p className="text-white text-lg">
              {searchTerm ? "Nenhum produto encontrado." : "Não há produtos cadastrados."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Preço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Unidade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {currentItems.map((product) => (
                  <tr 
                    key={product.id} 
                    className={`hover:bg-gray-750 ${product.isDerived ? 'bg-gray-750' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-white">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">R$ {product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">{product.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${product.isDerived ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white'}`}>
                        {product.isDerived ? 'Composto' : 'Simples'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      {product.isDerived && (
                        <button
                          onClick={() => handleViewRecipe(product)}
                          className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                          title="Ver receita"
                        >
                          <FaUtensils />
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(product.id)}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-1"
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                        title="Excluir"
                      >
                        <FaTrash />
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
          </div>
        )}

        {/* Recipe Modal */}
        <Modal 
          isOpen={showRecipeModal} 
          onClose={() => setShowRecipeModal(false)}
          title={`Receita: ${selectedProduct?.name || ''}`}
        >
          {selectedProduct && (
            <div className="space-y-4">
              <p className="text-gray-300">{selectedProduct.description}</p>
              
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white mb-2">Ingredientes:</h3>
                {selectedProduct.recipeItems.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedProduct.recipeItems.map((item) => (
                      <li key={item.id} className="flex justify-between items-center bg-gray-700 p-3 rounded">
                        <span className="text-white">{item.name}</span>
                        <span className="text-green-400">
                          {item.quantity} {item.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">Nenhum ingrediente cadastrado.</p>
                )}
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowRecipeModal(false)}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal 
          isOpen={showDeleteModal} 
          onClose={() => setShowDeleteModal(false)}
          title="Confirmar Exclusão"
        >
          <div className="space-y-4">
            <p className="text-white">Tem certeza que deseja excluir este produto?</p>
            <p className="text-gray-300 text-sm">Esta ação não pode ser desfeita.</p>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </Sidebar>
  );
}