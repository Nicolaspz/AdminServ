import { useState, useEffect } from 'react';
import { setupAPIClient } from '../../services/api';
import { toast } from "react-toastify";
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';

interface Product {
  id?: string;
  name: string;
  quantity: number;
  price: number;
  purchaseId: string;
}

interface PurchaseProductModalProps {
  purchaseId: string;
  onClose: () => void;
  onSuccess: () => void;
  status: boolean;
}

export default function ProductModal({ purchaseId, onClose, onSuccess, status }: PurchaseProductModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'purchaseId'>>({ 
    name: '', 
    quantity: 0, 
    price: 0 
  });

  const apiClient = setupAPIClient();

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get(`/compra/produto/${purchaseId}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast.error('Erro ao carregar produtos da compra');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [purchaseId]);

  const handleAddProduct = async () => {
    try {
      if (!newProduct.name.trim()) {
        toast.warning('Nome do produto é obrigatório');
        return;
      }

      const productToAdd = {
        ...newProduct,
        purchaseId
      };

      await apiClient.post('/compra/produto', productToAdd);
      toast.success('Produto adicionado com sucesso!');
      setNewProduct({ name: '', quantity: 0, price: 0 });
      fetchProducts();
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      toast.error('Erro ao adicionar produto');
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    try {
      await apiClient.delete(`/compra/produto/${productId}`);
      toast.success('Produto removido com sucesso!');
      fetchProducts();
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      toast.error('Erro ao remover produto');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {status ? 'Produtos da Compra' : 'Adicionar Produtos à Compra'}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {!status && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium mb-3">Adicionar Novo Produto</h3>
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-5">
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    placeholder="Nome do produto"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    name="quantity"
                    value={newProduct.quantity}
                    onChange={handleInputChange}
                    placeholder="Quantidade"
                    className="w-full px-3 py-2 border rounded"
                    min="0"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    placeholder="Preço unitário"
                    className="w-full px-3 py-2 border rounded"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-span-2">
                  <button
                    onClick={handleAddProduct}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded flex items-center justify-center gap-1"
                  >
                    <FaPlus /> Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {status ? 'Nenhum produto nesta compra' : 'Adicione produtos à compra'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço Unitário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    {!status && (
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{product.quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {(product.quantity * product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                      </td>
                      {!status && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => product.id && handleRemoveProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}