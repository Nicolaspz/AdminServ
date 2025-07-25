import { useContext, useEffect, useState } from 'react';
import { setupAPIClient } from '../../services/api';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';

interface AddToStockButtonProps {
  purchaseId: string;
  status: boolean;
  organizationId: string;
  onSuccess: () => void;
}

export default function AddToStockButton({ purchaseId, onSuccess, status, organizationId }: AddToStockButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useContext(AuthContext);
  const apiClient = setupAPIClient();
  
  const handleAddToStock = async () => {
    setIsLoading(true);
    try {
      await apiClient.post(
        '/stock',
        {
          organizationId: organizationId,
          purchaseId: purchaseId
        },
        {
          headers: { 
            Authorization: `Bearer ${user?.token}` 
          }
        }
      );
      toast.success('Produtos adicionados ao estoque!');
      onSuccess();
    } catch (error) {
      toast.error('Erro ao adicionar ao estoque');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToStock}
      disabled={status || isLoading}
      className={`bg-purple-600 text-white px-3 py-1 rounded text-sm ${isLoading ? 'opacity-50' : ''} ${status ? 'bg-slate-600 cursor-not-allowed' : 'hover:bg-purple-700'}`}
    >
      {status ? 'Compra fechada' : isLoading ? 'Processando...' : 'Adicionar ao Estoque'}
    </button>
  );
}