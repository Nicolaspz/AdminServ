import React, { useState, useEffect } from "react";
import { FaEdit, FaPlus, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

type RecipeItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  productId: string;
  impactaPreco: boolean;
  ingredient: {
    name: string;
    id: string;
    unit: string;
    price: number;
    PrecoVenda?: {
      preco_venda: number;
    }[];
  };
};

type Product = {
  id: string;
  name: string;
  isIgredient: boolean;
  PrecoVenda: {
    preco_venda: number;
    precoSugerido?: number;
    data_inicio?: string;
  }[];
};

type RecipeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  apiClient: any;
  user: any;
  fetchProducts: () => void;
  allProducts: Product[];
};

const ToggleSwitch = ({ 
  isOn, 
  onToggle,
  size = 'md'
}: {
  isOn: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const sizes = {
    sm: {
      container: 'w-10 h-5',
      knob: 'w-4 h-4'
    },
    md: {
      container: 'w-12 h-6',
      knob: 'w-5 h-5'
    },
    lg: {
      container: 'w-14 h-7',
      knob: 'w-6 h-6'
    }
  };

  return (
    <button
      type="button"
      className={`${sizes[size].container} flex items-center rounded-full p-0.5 cursor-pointer transition-colors focus:outline-none ${
        isOn ? 'bg-green-500 justify-end' : 'bg-gray-600 justify-start'
      }`}
      onClick={onToggle}
    >
      <div className={`${sizes[size].knob} bg-white rounded-full shadow-md transform transition-transform`} />
    </button>
  );
};

const RecipeModal: React.FC<RecipeModalProps> = ({
  isOpen,
  onClose,
  product,
  apiClient,
  user,
  fetchProducts,
  allProducts
}) => {
  const [recipeItems, setRecipeItems] = useState<RecipeItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddIngredient, setShowAddIngredient] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [impactaPreco, setImpactaPreco] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);

  const calculateTotal = () => {
    return recipeItems.reduce((total, item) => {
      const price = item.ingredient.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const handleAddIngredient = async () => {
    if (!selectedProduct || !product) return;
    
    try {
      const response = await apiClient.post("/recipe", {
        productId: product.id,
        ingredientId: selectedProduct,
        quantity: quantity,
        impactaPreco: impactaPreco
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      fetchRecipeItems();
      setShowAddIngredient(false);
      setSelectedProduct('');
      setQuantity(1);
      setImpactaPreco(true);
      toast.success("Ingrediente adicionado com sucesso!");
    } catch (error) {
      console.error("Error adding ingredient:", error.message);
      toast.warning(error.response?.data?.error);
    }
  };

  useEffect(() => {
    if (isOpen && product) {
      fetchRecipeItems();
    }
  }, [isOpen, product]);

  const fetchRecipeItems = async () => {
    if (!product?.id) return;
    
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/recipe/${product.id}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      
      console.log("Recipe items:", response.data);
      
      // Corrigindo o mapeamento dos dados
      const itemsWithPrices = response.data.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        productId: item.productId,
        impactaPreco: item.impactaPreco,
        ingredient: {
          id: item.ingredient.id,
          name: item.ingredient.name,
          unit: item.ingredient.unit,
          // Corrigindo o acesso ao preço de venda
          price: item.ingredient.PrecoVenda?.[0]?.preco_venda || 0,
          // Mantendo a estrutura original para compatibilidade
          PrecoVenda: item.ingredient.PrecoVenda
        }
      }));
      
      setRecipeItems(itemsWithPrices);
      
    } catch (error) {
      console.error("Error fetching recipe items:", error);
      toast.error("Erro ao carregar ingredientes da receita");
    } finally {
      setIsLoading(false);
    }
};
  const handleUpdateIngredient = async (item: RecipeItem) => {
    try {
      await apiClient.put(`/recipe`, {
        productId: item.productId,
        ingredientId: item.ingredient.id,
        quantity: item.quantity,
        impactaPreco: item.impactaPreco

      }, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}` 
        }
      });
      
      toast.success("Ingrediente atualizado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating ingredient:", error);
      toast.error("Erro ao atualizar ingrediente");
    }
  };

  const handleDeleteIngredient = async (id: string) => {
    try {
      await apiClient.delete(`/recipe/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      setRecipeItems(recipeItems.filter(item => item.id !== id));
      toast.success("Ingrediente removido com sucesso!");
    } catch (error) {
      console.error("Error deleting ingredient:", error);
      toast.error("Erro ao remover ingrediente");
    }
  };

  const toggleImpactaPreco = (id: string) => {
    setRecipeItems(recipeItems.map(item => 
      item.id === id ? {...item, impactaPreco: !item.impactaPreco} : item
    ));
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-700 px-6 py-4 sticky top-0 bg-gray-800 z-10">
          <h3 className="text-xl font-semibold text-white">
            Receita: {product.name}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                {recipeItems.length > 0 ? (
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="bg-gray-700 px-4 py-3 border-b border-gray-600 flex justify-between items-center">
                      <h4 className="font-semibold text-white">Ingredientes</h4>
                      {!isEditing && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setIsEditing(true)}
                            className="text-yellow-400 hover:text-yellow-300 text-sm flex items-center gap-1"
                          >
                            <FaEdit /> Editar
                          </button>
                          <button
                            onClick={() => setShowAddIngredient(true)}
                            className="text-green-400 hover:text-green-300 text-sm flex items-center gap-1"
                          >
                            <FaPlus /> Adicionar
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <table className="w-full">
                      <thead>
                        <tr className="text-gray-400 text-left border-b border-gray-700">
                          <th className="px-4 py-2">Ingrediente</th>
                          <th className="px-4 py-2 text-right">Preço Unitário</th>
                          <th className="px-4 py-2 text-right">Quantidade</th>
                          <th className="px-4 py-2 text-center">Impacta Preço</th>
                          <th className="px-4 py-2 text-right">Subtotal</th>
                          {isEditing && <th className="px-4 py-2 text-right">Ações</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {recipeItems.map((item) => (
                          <tr key={item.id} className="border-b border-gray-700 last:border-0">
                            <td className="px-4 py-3 text-white">{item.ingredient.name}</td>
                            <td className="px-4 py-3 text-right text-green-400">
                            {(item.ingredient.price * item.quantity).toFixed(2)} Kz
                            </td>
                            <td className="px-4 py-3 text-right">
                              {isEditing ? (
                                <div className="flex items-center justify-end gap-2">
                                  <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => {
                                      const updatedItems = recipeItems.map(ri => 
                                        ri.id === item.id ? {...ri, quantity: Number(e.target.value)} : ri
                                      );
                                      setRecipeItems(updatedItems);
                                    }}
                                    className="w-20 bg-gray-700 text-white px-2 py-1 rounded"
                                    min="1"
                                    step="1"
                                  />
                                  <span className="text-white">{item.ingredient.unit}</span>
                                </div>
                              ) : (
                                <span className="text-green-400">
                                  {item.quantity} {item.ingredient.unit}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {isEditing ? (
                                <div className="flex justify-center items-center gap-2">
                                  <ToggleSwitch 
                                    isOn={item.impactaPreco} 
                                    onToggle={() => toggleImpactaPreco(item.id)}
                                    size="md"
                                  />
                                  <span className="text-sm text-gray-300">
                                    {item.impactaPreco ? 'Sim' : 'Não'}
                                  </span>
                                </div>
                              ) : (
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                  item.impactaPreco ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {item.impactaPreco ? 'Sim' : 'Não'}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right text-yellow-400">
                              {(item.ingredient.price * item.quantity).toFixed(2)} Kz
                            </td>
                            {isEditing && (
                              <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => handleUpdateIngredient(item)}
                                    className="text-green-400 hover:text-green-300"
                                    title="Salvar"
                                  >
                                    <FaSave />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteIngredient(item.id)}
                                    className="text-red-400 hover:text-red-300"
                                    title="Excluir"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-750">
                          <td colSpan={4} className="px-4 py-3 text-right font-semibold text-white">
                            Total da Receita:
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-green-400">
                            {calculateTotal().toFixed(2)} Kz
                          </td>
                          {isEditing && <td></td>}
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-gray-400 mb-4">Nenhum ingrediente cadastrado.</p>
                    <button
                      onClick={() => setShowAddIngredient(true)}
                      className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
                    >
                      <FaPlus /> Adicionar Ingrediente
                    </button>
                  </div>
                )}
              </div>

              {showAddIngredient && (
                <div className="bg-gray-750 p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-white">Adicionar Ingrediente</h4>
                    <button
                      onClick={() => setShowAddIngredient(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-3">
                        <label className="block text-gray-300 mb-2">Produto*</label>
                        <select
                          value={selectedProduct}
                          onChange={(e) => setSelectedProduct(e.target.value)}
                          className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                        >
                          <option value="">Selecione um produto</option>
                          {allProducts
                            .filter(p => p.isIgredient)
                            .map(product => (
                              <option key={product.id} value={product.id}>
                                {product.name}
                              </option>
                            ))}
                        </select>
                      </div>
            
                      <div className="col-span-1">
                        <label className="block text-gray-300 mb-2">Quantidade*</label>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                          min="1"
                          step="1"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-gray-300">Impacta no preço?</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-300">{impactaPreco ? 'Sim' : 'Não'}</span>
                        <ToggleSwitch 
                          isOn={impactaPreco} 
                          onToggle={() => setImpactaPreco(!impactaPreco)}
                          size="md"
                        />
                      </div>
                    </div>
            
                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        onClick={() => setShowAddIngredient(false)}
                        className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleAddIngredient}
                        className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
                        disabled={!selectedProduct}
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            
              <div className="flex justify-end gap-3 mt-6">
                {isEditing && (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancelar Edição
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Fechar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;