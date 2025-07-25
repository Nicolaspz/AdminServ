import { FiTrendingUp } from "react-icons/fi";

 export function MetricCard({ title, value, change, trend = "up", icon, color }: {
  title: string;
  value: string;
  change?: number;
  trend?: "up" | "down" | "neutral";
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
      <div className="flex justify-between">
        <div className={`${color} p-3 rounded-full`}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={`flex items-center text-sm font-medium ${
            trend === "up" ? "text-green-600" : 
            trend === "down" ? "text-red-600" : "text-amber-600"
          }`}>
            {trend === "up" ? "+" : trend === "down" ? "-" : ""}
            {change && (change * 100).toFixed(0)}%
            {trend === "up" ? (
              <FiTrendingUp className="ml-1" />
            ) : trend === "down" ? (
              <svg className="w-4 h-4 ml-1 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            ) : null}
          </div>
        )}
      </div>
      <h3 className="text-sm text-slate-500 mt-4">{title}</h3>
      <p className="text-2xl font-semibold text-slate-800 mt-1">{value}</p>
    </div>
  );
}
