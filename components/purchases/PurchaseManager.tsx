import { useState } from 'react';
import PurchaseList from './PurchaseList';

export default function PurchaseManager() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="p-4">
    <h1 className="text-2xl font-bold mb-6">Gestão de Compras</h1>
    
    <div className="w-full">
      <PurchaseList refreshKey={refreshKey} />
    </div>
  </div>
  
  );
}