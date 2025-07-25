import { useContext, useEffect, useState } from 'react';
import { setupAPIClient } from '../../services/api';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';

interface PurchaseItem {
  id: string;
  purchasePrice: number;
  quantity: number;
  productId: string;
  purchaseId: string;
  product: {
    id: string;
    name: string;
  };
  purchased: {
    name: string;
    description: string;
  };
}

interface PurchaseProductsTableProps {
  purchaseId: string;
  onUpdate?: () => void;
  status: boolean;
}

export default function PurchaseProductsTable({ 
  purchaseId, 
  onUpdate,
  status
}: PurchaseProductsTableProps) {
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const apiClient = setupAPIClient();
  const { user } = useContext(AuthContext);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/produts_list_compra`,{
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        params: {
          purchaseId
        }
      });

      setItems(response.data);
    } catch (error) {
      toast.error('Erro ao carregar itens da compra');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (purchaseId) {
      fetchItems();
    }
  }, [purchaseId]);

  const handleRemoveItem = async (productId: string, purchaseId: string) => {
    try {
      if (!productId || !purchaseId) {
        throw new Error('IDs inválidos');
      }
  
      const response = await apiClient.delete('/remuvProdcompra', {
        params: {
          productId: productId.trim(),
          purchaseId: purchaseId.trim()
        },
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.status === 204) {
        toast.success('Produto removido com sucesso');
        fetchItems();
        onUpdate?.();
      } else {
        throw new Error('Resposta inesperada do servidor');
      }
    } catch (error: any) {
      console.error('Erro completo:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Erro ao remover item');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-700">
        <thead className="bg-slate-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Produto</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Preço Unitário</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Quantidade</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-slate-800 divide-y divide-slate-700">
          {isLoading ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-slate-300">Carregando itens...</td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-slate-300">Nenhum item adicionado à compra</td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-700/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-slate-200">{item.product.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                  {item.purchasePrice.toLocaleString('pt-AO', {
                    style: 'currency',
                    currency: 'AOA'
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                  {(item.purchasePrice * item.quantity).toLocaleString('pt-AO', {
                    style: 'currency',
                    currency: 'AOA'
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => {
                      const confirmDelete = window.confirm('Tem certeza que deseja remover este item?');
                      if (confirmDelete) {
                        handleRemoveItem(item.product.id, item.purchaseId);
                      }
                    }}
                    className={`text-red-400 hover:text-red-300 ${status ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={status}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}