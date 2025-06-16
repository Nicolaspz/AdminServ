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

export default function AddToStockButton({ purchaseId, onSuccess,status,organizationId }: AddToStockButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useContext(AuthContext);
  const apiClient = setupAPIClient();
  
  const handleAddToStock = async () => {
    console.log(purchaseId)
    console.log("IdOrganization", organizationId)
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
      disabled={status}
      className={`bg-purple-500 text-white px-3 py-1 rounded text-sm ${isLoading ? 'opacity-50' : ''}`}

    >
      {status ? 'Compra fechada' : 'Adicionar ao Estoque'}
    </button>
  );
}