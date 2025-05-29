import React, { useState, useEffect, useContext } from "react";
import { setupAPIClient } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import { FaEye, FaEyeSlash, FaChevronDown, FaChevronUp, FaPlus } from 'react-icons/fa';
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  unit: string;
  is_fractional: boolean;
  isDerived: boolean;
  category: {
    id: string;
    name: string;
  };
  Stock: {
    quantity: number;
    id: string;
  }[];
  recipeItems?: {
    ingredient: {
      id: string;
      name: string;
    };
    quantity: number;
  }[];
};

export default function Stock() {
  const [products, setProducts] = useState<Product[]>([]);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null);
  const { user } = useContext(AuthContext);
  const apiClient = setupAPIClient();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchStock() {
     
      try {
        const response = await apiClient.get(`/stock/${user.organizationId}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
          
        );
        
        setProducts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao buscar estoque:", error);
        setIsLoading(false);
        console.log("erros ",error);
      }
    }

    fetchStock();
  }, [user]);

  const toggleExpandProduct = (productId: string) => {
    setExpandedProductId((prev) => (prev === productId ? null : productId));
  };

  const toggleExpandRecipe = (productId: string) => {
    setExpandedRecipeId((prev) => (prev === productId ? null : productId));
  };

  const renderProductItem = (product: Product) => {
    const stockQuantity = product.Stock.reduce((sum, stock) => sum + stock.quantity, 0);

    return (
      <div key={product.id} className="bg-gray-800 p-4 rounded-lg mb-4 shadow-md">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2 w-full md:w-auto">
            <span className="text-lg font-bold text-white">{product.name}</span>
            <span className="text-gray-300">{product.category.name}</span>
          </div>

          <div className="flex items-center gap-4 mb-2">
            <span className="text-green-400 font-bold">
              {stockQuantity} {product.unit}
            </span>
            <span className="text-white">
              Preço: R$ {product.price.toFixed(2)}
            </span>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => toggleExpandProduct(product.id)} 
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              {expandedProductId === product.id ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
            </button>

            {product.isDerived && (
              <button 
                onClick={() => toggleExpandRecipe(product.id)} 
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                {expandedRecipeId === product.id ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            )}
          </div>
        </div>

        {expandedProductId === product.id && (
          <div className="mt-4 p-3 bg-gray-700 rounded-md">
            <p className="text-white mb-2">{product.description}</p>
            <p className="text-gray-300">
              {product.is_fractional ? "Pode ser vendido fracionado" : "Não pode ser vendido fracionado"}
            </p>
          </div>
        )}

        {expandedRecipeId === product.id && product.recipeItems && (
          <div className="mt-4 p-3 bg-gray-700 rounded-md">
            <h3 className="text-lg font-bold text-white mb-2">Receita/Componentes:</h3>
            <ul className="space-y-2">
              {product.recipeItems.map((item) => (
                <li key={item.ingredient.id} className="flex justify-between items-center">
                  <span className="text-white">{item.ingredient.name}</span>
                  <span className="text-green-400">
                    {item.quantity} {product.unit}
                  </span>
                </li>
              ))}
            </ul>
            <button className="mt-3 flex items-center gap-2 text-blue-400 hover:text-blue-300">
              <FaPlus /> Adicionar componente
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <Sidebar>
      <Header />
      <div className="min-h-screen bg-gray-900 p-5">
        <h1 className="text-2xl font-bold text-white mb-6">Estoque de Produtos</h1>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
            <p className="text-white text-lg">Carregando estoque...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center h-screen">
            <p className="text-white text-lg">Não há produtos em estoque no momento.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {products.map((product) => renderProductItem(product))}
          </div>
        )}
      </div>
    </Sidebar>
  );
}