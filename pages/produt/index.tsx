import React, { useState, useEffect, useContext } from "react";
import { setupAPIClient } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import { FaEye, FaEdit, FaTrash, FaPlus, FaSearch, FaUtensils, FaTimes } from 'react-icons/fa';
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { API_BASE_URL } from '../../config';
import { toast, ToastContainer } from 'react-toastify';
import Modal from "../../components/Modal";
import RecipeModal from "../../components/recipe/RecipeModal";

type Category = {
  id: string;
  name: string;
  organizationId: string;
};

type RecipeItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  ingredient: {
  name: string;
    
  }
  
  
};

type Product = {
  id: string;
  name: string;
  description: string;
  banner?: string;
  unit: string;
  is_fractional: boolean;
  isDerived: boolean;
  isIgredient: boolean;
  PrecoVenda: {
    preco_venda: number;
  }[];
  recipeItems: RecipeItem[];
  categoryId: string;
  organizationId: string;
  price?: number; // Adicionado para compatibilidade
};

const DERIVED_CATEGORY_ID = "5d63b5df-b11b-4eee-a9fc-4fb1b1eb8efa";

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
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unit: 'un',
    isDerived: false,
    categoryId: '',
    file: null as File | null,
    previewImage: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const apiClient = setupAPIClient();

  useEffect(() => {
    if (!user || !user?.organizationId || !user?.token) {
      setIsLoading(false);
      return;
    }
    fetchData();
  }, [user]);

  async function fetchData() {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        apiClient.get('/produts', {
          params: { organizationId: user.organizationId },
          headers: { Authorization: `Bearer ${user.token}` }
        }),
        apiClient.get('/category', {
          params: { organizationId: user.organizationId },
          headers: { Authorization: `Bearer ${user.token}` }
        })
      ]);
  
      // Processar os produtos para incluir preços
      const processedProducts = productsResponse.data.map(product => ({
        ...product,
        PrecoVenda: product.PrecoVenda || [], // Garante que exista o array
        recipeItems: product.recipeItems?.map(item => ({
          ...item,
          ingredient: {
            ...item.ingredient,
            price: item.ingredient.PrecoVenda?.[0]?.preco_venda || 0
          }
        })) || []
      }));
  
      const filteredProducts = processedProducts.filter(
        (product: Product) => product.isIgredient === false
      );
      
      setProducts(filteredProducts);
      setFilteredProducts(filteredProducts);
      setAllProducts(processedProducts);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erro ao carregar produtos");
    } finally {
      setIsLoading(false);
    }
  }

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
    setSelectedProduct({
      ...product,
      PrecoVenda: product.PrecoVenda || []
    });
    setShowRecipeModal(true);
  };
  
  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      
      unit: 'un',
      isDerived: false,
      categoryId: '',
      file: null,
      previewImage: ''
    });
    setShowProductModal(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      
      unit: product.unit,
      isDerived: product.isDerived,
      categoryId: product.categoryId,
      file: null,
      previewImage: product.banner ? `${API_BASE_URL}/tmp/${product.banner}` : ''
    });
    setShowProductModal(true);
  };

  const handleDelete = (productId: string) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete || !user) return;
    
    try {
      await apiClient.delete('/produt', {
        params: {
          productId: productToDelete
        },
        headers: { 
          Authorization: `Bearer ${user.token}` 
        }
      });
      
      setProducts(products.filter(p => p.id !== productToDelete));
      setFilteredProducts(filteredProducts.filter(p => p.id !== productToDelete));
      setShowDeleteModal(false);
      setProductToDelete(null);
      toast.success('Produto excluído com sucesso!');
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error('Erro ao excluir o produto!');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        file,
        previewImage: URL.createObjectURL(file)
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
     
    }));
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      formPayload.append('description', formData.description);
      
      formPayload.append('unit', formData.unit);
      formPayload.append('isDerived', formData.isDerived.toString());
      
      const categoryId = formData.isDerived ? DERIVED_CATEGORY_ID : formData.categoryId;
      formPayload.append('categoryId', categoryId);
      formPayload.append('organizationId', user.organizationId);
      
      if (formData.file) {
        formPayload.append('file', formData.file);
      }

      if (editingProduct) {
        const response = await apiClient.put(`/produt/${editingProduct.id}`, formPayload, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`
          }
        });
        
        setProducts(products.map(p => p.id === editingProduct.id ? response.data : p));
        toast.success('Produto atualizado com sucesso!');
      } else {
        const response = await apiClient.post('/produts', formPayload, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`
          }
        });
        
        setProducts([...products, response.data]);
        toast.success('Produto cadastrado com sucesso!');
      }

      setShowProductModal(false);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error('Erro ao salvar produto');
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Anterior
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Próxima
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a{' '}
              <span className="font-medium">{Math.min(indexOfLastItem, filteredProducts.length)}</span> de{' '}
              <span className="font-medium">{filteredProducts.length}</span> produtos
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Anterior</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Próxima</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  const ProductModal = () => {
    if (!showProductModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
          <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {editingProduct ? 'Editar Produto' : 'Adicionar Produto'}
            </h3>
            <button 
              onClick={() => setShowProductModal(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <FaTimes />
            </button>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome*</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preço*</label>
                      <input
                        type="number"
                        name="price"
                        
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unidade*</label>
                      <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="un">Unidade</option>
                        <option value="kg">Quilograma</option>
                        <option value="g">Grama</option>
                        <option value="l">Litro</option>
                        <option value="ml">Mililitro</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isDerived"
                      checked={formData.isDerived}
                      onChange={(e) => {
                        const isDerived = e.target.checked;
                        setFormData({
                          ...formData,
                          isDerived,
                          categoryId: isDerived ? DERIVED_CATEGORY_ID : ''
                        });
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Produto Derivado (Ingrediente)</label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {formData.isDerived ? 'Categoria Fixa (Insumos)' : 'Categoria*'}
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      disabled={formData.isDerived}
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Imagem</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {(formData.previewImage || editingProduct?.banner) && (
                      <div className="mt-2">
                        <img 
                          src={formData.previewImage || `${API_BASE_URL}/tmp/${editingProduct?.banner}`} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded border border-gray-300"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {editingProduct ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Sidebar>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Lista de Produtos</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Pesquisar produtos..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 whitespace-nowrap"
              onClick={handleAddProduct}
            >
              <FaPlus /> Adicionar Produto
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {filteredProducts.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-500 text-lg mb-4">
                  {searchTerm ? (
                    "Nenhum produto encontrado com o termo pesquisado"
                  ) : (
                    "Nenhum produto cadastrado no momento"
                  )}
                </div>
                {!searchTerm && (
                  <button 
                    onClick={handleAddProduct}
                    className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                  >
                    <FaPlus /> Adicionar primeiro produto
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Imagem
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Preço
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unidade
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {product.banner ? (
                              <img 
                                src={`${API_BASE_URL}/tmp/${product.banner}`}
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <FaUtensils className="text-gray-400" />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            {product.description && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {product.description}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.PrecoVenda?.[0]?.preco_venda?.toFixed(2) || '0.00'} Kz
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.isDerived ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {product.isDerived ? 'Derivado' : 'Simples'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              {product.isDerived && (
                                <button
                                  onClick={() => handleViewRecipe(product)}
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                  title="Ver receita"
                                >
                                  <FaUtensils />
                                </button>
                              )}
                              <button
                                onClick={() => handleEdit(product)}
                                className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50"
                                title="Editar"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                                title="Excluir"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {renderPagination()}
              </>
            )}
          </div>
        )}

        {/* Modals */}
        <ProductModal />
        {showRecipeModal && selectedProduct && (
  <RecipeModal
    isOpen={showRecipeModal}
    onClose={() => {
      setShowRecipeModal(false);
      setSelectedProduct(null);
    }}
    product={{
      ...selectedProduct,
      // Garante que PrecoVenda está no formato esperado
      PrecoVenda: selectedProduct.PrecoVenda || []
    }}
    apiClient={apiClient}
    user={user}
    fetchProducts={fetchData}
    allProducts={allProducts.map(p => ({
      ...p,
      // Processa os preços para cada produto
      PrecoVenda: p.PrecoVenda || [],
      // Adiciona price ao ingredient se necessário
      ...(p.isIgredient ? { price: p.PrecoVenda?.[0]?.preco_venda || 0 } : {})
    }))}
  />
)}

        <Modal 
          isOpen={showDeleteModal} 
          onClose={() => setShowDeleteModal(false)}
          title="Confirmar Exclusão"
        >
          <div className="space-y-4">
            <p className="text-gray-700">Tem certeza que deseja excluir este produto?</p>
            <p className="text-gray-500 text-sm">Esta ação não pode ser desfeita.</p>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </Modal>

        
      </div>
    </Sidebar>
  );
}