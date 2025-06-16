import React, { useState, useEffect, useContext } from "react";
import { setupAPIClient } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import { FaEye, FaEdit, FaTrash, FaPlus, FaSearch, FaUtensils, FaTimes } from 'react-icons/fa';
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { API_BASE_URL } from '../../config';
import { toast, ToastContainer } from 'react-toastify';
import Modal from "../../components/Modal";

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
  price: number;
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

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
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
    if (!user?.organizationId) return;
  
    async function fetchData() {
      console.log("user",user);
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
  
        // Filtrar apenas produtos com isIngredient true
        const allProducts = productsResponse.data;
        const ingredientProducts = productsResponse.data.filter(
          (product: Product) => product.isIgredient === true
        );
        
        // Armazenar todos os produtos e também apenas os ingredientes
        //console.log("Igrediente",ingredientProducts);
        //console.log("todos",allProducts);
        setProducts(ingredientProducts);
        setFilteredProducts(ingredientProducts); // ou ingredientProducts se quiser mostrar só ingredientes por padrão
        setCategories(categoriesResponse.data);
        setIsLoading(false);
  
        // Se precisar dos produtos ingredientes em outro lugar, pode armazenar em outro estado
        // setIngredientProducts(ingredientProducts);
        
      } catch (error) {
        console.log("Error fetching data:", error);
        setIsLoading(false);
      }
    }
  
    fetchData();
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

  

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
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
      price: product.price,
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
      toast.error('Erro ao  excluír o Produto!');
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
  
 
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      formPayload.append('description', formData.description);
      formPayload.append('price', formData.price.toString());
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
        toast.success('Produto actualizado com sucesso!');
      } else {
        const response = await apiClient.post('/produts', formPayload, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`
          }
        });
        
        setProducts([...products, response.data]);
        toast.success('Produto salvo com sucesso!');
      }

      setShowProductModal(false);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error('Erro ao salvar produto');
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftOffset = Math.floor(maxVisiblePages / 2);
      const rightOffset = Math.ceil(maxVisiblePages / 2) - 1;
      
      let startPage = currentPage - leftOffset;
      let endPage = currentPage + rightOffset;
      
      if (startPage < 1) {
        startPage = 1;
        endPage = maxVisiblePages;
      }
      
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = totalPages - maxVisiblePages + 1;
      }
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return (
      <div className="flex justify-between items-center mt-4">
        <div className="text-white">
          Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredProducts.length)} de {filteredProducts.length} itens
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
          >
            «
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
          >
            ‹
          </button>
          
          {pages.map((page, index) => (
            page === '...' ? (
              <span key={index} className="px-3 py-1">...</span>
            ) : (
              <button
                key={index}
                onClick={() => setCurrentPage(Number(page))}
                className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-green-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
              >
                {page}
              </button>
            )
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
          >
            ›
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
          >
            »
          </button>
        </div>
      </div>
    );
  };

  
  
  const ProductModal = () => {
    if (!showProductModal) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      
      // Atualiza o estado de forma correta sem causar re-render desnecessário
      setFormData(prev => ({
        ...prev,
        [name]: name === 'price' ? parseFloat(value) || 0 : value
      }));
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl">
          <div className="flex justify-between items-center border-b border-gray-700 px-6 py-4">
            <h3 className="text-xl font-semibold text-white">
              {editingProduct ? 'Editar Produto' : 'Adicionar Produto'}
            </h3>
            <button 
              onClick={() => setShowProductModal(false)}
              className="text-gray-400 hover:text-white"
            >
              <FaTimes />
            </button>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Nome*</label>
                      <input
                          key="name-input"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Descrição</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Preço*</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Unidade*</label>
                      <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  <div>
                    <label className="block text-gray-300 mb-2">Tipo</label>
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
                        className="mr-2 h-5 w-5 text-green-500 rounded focus:ring-green-500"
                      />
                      <span className="text-gray-300">Produto Derivado (Igrediente)</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">
                      {formData.isDerived ? 'Categoria Fixa (Insumos)' : 'Categoria*'}
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    <label className="block text-gray-300 mb-2">Imagem</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full text-white mb-2"
                    />
                    {(formData.previewImage || editingProduct?.banner) && (
                      <div className="mt-2">
                        <img 
                          src={formData.previewImage || `${API_BASE_URL}/tmp/${editingProduct?.banner}`} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded border border-gray-600"
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
                  className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded"
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
      <div className="container mx-auto mr-1.2 px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">Lista de Igrediente</h1>
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
              onClick={handleAddProduct}
            >
              <FaPlus /> Adicionar
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-white mb-4">
          <span>Itens por página:</span>
          <select 
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-gray-700 text-white px-2 py-1 rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
            <p className="text-black text-lg">Carregando produtos...</p>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Imagem</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nome</th>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.banner ? (
                        <img 
                          src={`${API_BASE_URL}/tmp/${product.banner}`}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                          <FaUtensils className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">{product.price.toFixed(2)} Kz</td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">{product.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${product.isDerived ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white'}`}>
                        {product.isIgredient ? 'Igrediente' : 'Simples'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      
                      <button
                        onClick={() => handleEdit(product)}
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

            {renderPagination()}
          </div>
        )}

        {/* Modals */}
        <ProductModal />
        
        <Modal 
          isOpen={showRecipeModal} 
          onClose={() => setShowRecipeModal(false)}
          title={`Receita: ${selectedProduct?.name || ''}`}
        >
          {selectedProduct && (
            <div className="space-y-4">
              <p className="text-gray-300">{selectedProduct.description}</p>
              
              <div className="mt-4">
               
                {selectedProduct.recipeItems.length > 0 ? (
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="bg-gray-700 px-4 py-3 border-b border-gray-600">
                    <h4 className="font-semibold text-white">Ingredientes</h4>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="text-gray-400 text-left border-b border-gray-700">
                        <th className="px-4 py-2">Nome</th>
                        <th className="px-4 py-2 text-right">Quantidade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProduct.recipeItems.map((item) => (
                        <tr key={item.id} className="border-b border-gray-700 last:border-0">
                          <td className="px-4 py-3 text-white">{item.ingredient.name}</td>
                          <td className="px-4 py-3 text-green-400 text-right">
                            {item.quantity} {item.unit}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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