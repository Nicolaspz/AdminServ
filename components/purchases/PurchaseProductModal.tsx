import { useContext, useState } from 'react';
import PurchaseProductsTable from './PurchaseProductsTable';
import AvailableProductsTable from './AvailableProductsTable';
import { AuthContext } from "../../contexts/AuthContext";

interface PurchaseProductModalProps {
  purchaseId: string;
  onClose: () => void;
  onSuccess: () => void;
  status: boolean;
  
}


export default function PurchaseProductModal({ 
  purchaseId, 
  onClose,
  status,

}: PurchaseProductModalProps) {
  const [activeTab, setActiveTab] = useState<'current' | 'available'>('current');
  const { user } = useContext(AuthContext);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddSuccess = () => {
    setActiveTab('current')    // Muda para aba de Produtos na Compra
    setRefreshKey(prev => prev + 1);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold">Gestão de Produtos da Compra</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex border-b mb-4">
            <button
              className={`px-4 py-2 ${activeTab === 'current' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('current')}
            >
              Produtos na Compra
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'available' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('available')}
              disabled={status}
            >
              Adicionar Produtos
            </button>
          </div>
          
          {activeTab === 'current' ? (
            <PurchaseProductsTable
              purchaseId={purchaseId}
              onUpdate={handleAddSuccess}
              key={refreshKey}
              status={status}
            />
          ) : (
            <AvailableProductsTable 
              purchaseId={purchaseId} 
              onAddSuccess={handleAddSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
}