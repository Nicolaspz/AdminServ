import { useState } from 'react';
import PurchaseProductModal from './PurchaseProductModal';
import AddToStockButton from './AddToStockButton';

interface PurchaseCardProps {
  purchase: {
    id: string;
    name: string;
    description: string;
    status: boolean;
    created_at:string

  };
  onUpdate: () => void;
  organizationId: string;
}

export default function PurchaseCard({ purchase, onUpdate,organizationId }: PurchaseCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-4 w-full max-w-xs text-center mx-auto">
  <h3 className="text-lg font-semibold text-gray-800">{purchase.name}</h3>
  <p className="text-sm text-gray-600 mt-1">{purchase.description}</p>
  <p className="text-xs text-gray-400 mt-1">{purchase.created_at}</p>

  <div className="flex justify-center gap-2 mt-4">
    <button 
      onClick={() => setShowModal(true)}
      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-sm transition-all"
    >
      {purchase.status ? 'Ver Lista' : 'Adicionar Itens'}
    </button>

    <AddToStockButton 
      purchaseId={purchase.id} 
      onSuccess={onUpdate}
      status={purchase.status}
      organizationId={organizationId}
    />
  </div>

  {showModal && (
    <PurchaseProductModal
      purchaseId={purchase.id}
      onClose={() => setShowModal(false)}
      onSuccess={onUpdate}
      status={purchase.status}
    />
  )}
</div>

  );
}