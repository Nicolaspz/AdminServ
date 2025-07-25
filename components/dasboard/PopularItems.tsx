export function PopularItems({ items }: { items: { name: string; sales: number }[] }) {
  const maxSales = Math.max(...items.map(item => item.sales));

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index}>
          <div className="flex justify-between text-sm text-slate-700 mb-1">
            <span>{item.name}</span>
            <span>{item.sales} vendas</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full"A
              style={{ width: `${(item.sales / maxSales) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
