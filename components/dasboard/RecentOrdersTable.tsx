type Order = {
  id: string;
  customer: string;
  amount: string;
  status: string;
  time: string;
};

export function RecentOrdersTable({ orders }: { orders: Order[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Entregue': return 'bg-green-100 text-green-800';
      case 'Preparando': return 'bg-blue-100 text-blue-800';
      case 'Pendente': return 'bg-amber-100 text-amber-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Pedido</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cliente</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Valor</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tempo</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {orders.map((order, index) => (
            <tr key={index}>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900">{order.id}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{order.customer}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{order.amount}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{order.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
