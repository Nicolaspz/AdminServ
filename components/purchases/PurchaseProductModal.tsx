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
    setActiveTab('current');
    setRefreshKey(prev => prev + 1);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-slate-700">
        <div className="flex justify-between items-center border-b border-slate-700 p-4">
          <h3 className="text-lg font-semibold text-slate-200">Gestão de Produtos da Compra</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            ✕
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex border-b border-slate-700 mb-4">
            <button
              className={`px-4 py-2 text-slate-300 ${activeTab === 'current' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('current')}
            >
              Produtos na Compra
            </button>
            <button
              className={`px-4 py-2 text-slate-300 ${activeTab === 'available' ? 'border-b-2 border-blue-500' : ''} ${status ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !status && setActiveTab('available')}
              disabled={status}
            >
              Adicionar Produtos
            </button>
          </div>
          
          {activeTab === 'current' ? (
            <div className="max-h-[70vh] overflow-y-auto p-4">
              <PurchaseProductsTable
                purchaseId={purchaseId}
                onUpdate={handleAddSuccess}
                key={refreshKey}
                status={status}
              />
            </div>
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
