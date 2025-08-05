import React, { useState, useEffect, useContext } from "react";
import { setupAPIClient } from "../../../services/api";
import { AuthContext } from "../../../contexts/AuthContext";
import { FiEye, FiEdit2, FiTrash2, FiPlus, FiSearch, FiX,FiChevronRight,FiChevronLeft } from 'react-icons/fi';
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import { API_BASE_URL } from '../../../config';
import { toast } from 'react-toastify';
import Modal from "../../../components/Modal";
import Head from "next/head";

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
  recipeItems: RecipeItem[];
  categoryId: string;
  organizationId: string;
};

const DERIVED_CATEGORY_ID = "5d63b5df-b11b-4eee-a9fc-4fb1b1eb8efa";

export default function IngredientsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
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

      const ingredientProducts = productsResponse.data.filter(
        (product: Product) => product.isIgredient === true
      );
     
      setProducts(ingredientProducts);
      setFilteredProducts(ingredientProducts);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erro ao carregar ingredientes");
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
      toast.success('Ingrediente excluído com sucesso!');
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error('Erro ao excluir o ingrediente!');
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
      [name]: value
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
      formPayload.append('isIgredient', 'true');
      
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
        toast.success('Ingrediente atualizado com sucesso!');
      } else {
        const response = await apiClient.post('/produts', formPayload, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`
          }
        });
        
        setProducts([...products, response.data]);
        toast.success('Ingrediente cadastrado com sucesso!');
      }

      setShowProductModal(false);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error('Erro ao salvar ingrediente');
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const visiblePages = () => {
      if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }
      if (currentPage <= 3) {
        return [1, 2, 3, 4, '...', totalPages];
      }
      if (currentPage >= totalPages - 2) {
        return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      }
      return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    };

    return (
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
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-600 bg-slate-700 text-sm font-medium ${
                  currentPage === 1 ? 'text-slate-500 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-600'
                }`}
              >
                <span className="sr-only">Anterior</span>
                <FiChevronLeft className="h-5 w-5" />
              </button>
              
              {visiblePages().map((page, index) => (
                typeof page === 'number' ? (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? 'z-10 bg-slate-600 border-slate-500 text-white'
                        : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={`ellipsis-${index}`} className="relative inline-flex items-center px-4 py-2 border border-slate-600 bg-slate-700 text-sm font-medium text-slate-300">
                    ...
                  </span>
                )
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-600 bg-slate-700 text-sm font-medium ${
                  currentPage === totalPages ? 'text-slate-500 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-600'
                }`}
              >
                <span className="sr-only">Próxima</span>
                <FiChevronRight className="h-5 w-5" />
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
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-3xl border border-slate-700">
          <div className="flex justify-between items-center border-b border-slate-700 px-6 py-4">
            <h3 className="text-xl font-semibold text-slate-200">
              {editingProduct ? 'Editar Ingrediente' : 'Adicionar Ingrediente'}
            </h3>
            <button 
              onClick={() => setShowProductModal(false)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Nome*</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm bg-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Descrição</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm bg-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Unidade*</label>
                      <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm bg-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
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
                      className="h-4 w-4 text-slate-500 focus:ring-slate-500 border-slate-600 rounded bg-slate-700"
                    />
                    <label className="ml-2 block text-sm text-slate-300">Produto Derivado</label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      {formData.isDerived ? 'Categoria Fixa (Insumos)' : 'Categoria*'}
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm bg-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
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
                    <label className="block text-sm font-medium text-slate-300 mb-1">Imagem</label>
                    <div className="mt-1 flex items-center gap-4">
                      <label className="cursor-pointer">
                        <div className="px-4 py-2 border border-slate-600 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors">
                          Selecionar arquivo
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      {formData.previewImage && (
                        <div className="relative">
                          <img 
                            src={formData.previewImage} 
                            alt="Preview" 
                            className="w-16 h-16 object-cover rounded border border-slate-600"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({...formData, previewImage: '', file: null})}
                            className="absolute -top-2 -right-2 bg-slate-700 rounded-full p-1 border border-slate-600 hover:bg-slate-600"
                          >
                            <FiX className="text-slate-300 h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-600 hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
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
    <>
      <Head>
            <title>ServeFixe - Igrediente</title>
      </Head>
    <Sidebar>
      <Header title="Igrediente" />
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-slate-200">Lista de Ingredientes</h1>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Pesquisar ingredientes..."
                className="block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <FiX className="text-slate-400 hover:text-slate-300" />
                </button>
              )}
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 whitespace-nowrap"
              onClick={handleAddProduct}
            >
              <FiPlus /> Adicionar Ingrediente
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-slate-800 shadow-lg rounded-lg overflow-hidden border border-slate-700">
            {filteredProducts.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-slate-400 text-lg mb-4">
                  {searchTerm ? (
                    "Nenhum ingrediente encontrado com o termo pesquisado"
                  ) : (
                    "Nenhum ingrediente cadastrado no momento"
                  )}
                </div>
                {!searchTerm && (
                  <button 
                    onClick={handleAddProduct}
                    className="text-slate-300 hover:text-white font-medium inline-flex items-center gap-1 transition-colors"
                  >
                    <FiPlus /> Adicionar primeiro ingrediente
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-700">
                    <thead className="bg-slate-750">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                          Imagem
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                          Nome
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                          Unidade
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-slate-800 divide-y divide-slate-700">
                      {currentItems.map((product) => (
                        <tr key={product.id} className="hover:bg-slate-750 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {product.banner ? (
                              <img 
                                src={`${API_BASE_URL}/tmp/${product.banner}`}
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                                <FiEye className="text-slate-400" />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-slate-200">{product.name}</div>
                            {product.description && (
                              <div className="text-sm text-slate-400 truncate max-w-xs">
                                {product.description}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                            {product.unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.isDerived ? 'bg-blue-900/30 text-blue-400' : 'bg-green-900/30 text-green-400'
                            }`}>
                              {product.isDerived ? 'Derivado' : 'Simples'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="text-slate-300 hover:text-yellow-400 p-1.5 rounded-full hover:bg-slate-700 transition-colors"
                                title="Editar"
                              >
                                <FiEdit2 />
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="text-slate-300 hover:text-red-400 p-1.5 rounded-full hover:bg-slate-700 transition-colors"
                                title="Excluir"
                              >
                                <FiTrash2 />
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
        
        <Modal 
          isOpen={showDeleteModal} 
          onClose={() => setShowDeleteModal(false)}
          title="Confirmar Exclusão"
        >
          <div className="space-y-4">
            <p className="text-slate-300">Tem certeza que deseja excluir este ingrediente?</p>
            <p className="text-slate-400 text-sm">Esta ação não pode ser desfeita.</p>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </Sidebar>
    </>
  );
}