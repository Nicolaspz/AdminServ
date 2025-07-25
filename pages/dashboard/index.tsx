import React, { useContext, useEffect, useState } from "react";
import { FiTrendingUp, FiDollarSign, FiUsers, FiCoffee, FiClock, FiPieChart } from "react-icons/fi";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { AuthContext } from "../../contexts/AuthContext";
import { setupAPIClient } from "../../services/api";
import dayjs from "dayjs";
import { MetricCard } from "../../components/dasboard/MetricCard";
import { LineChart } from "../../components/dasboard/LineChart";
import { PieChart } from "../../components/dasboard/PieChart";
import { RecentOrdersTable } from "../../components/dasboard/RecentOrdersTable";
import { PopularItems } from "../../components/dasboard/PopularItems";

// Registrando componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [report, setReport] = useState<any>(null);
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [timeRange, setTimeRange] = useState<string>("today");
  const apiClient = setupAPIClient();

  // Dados mockados para exemplo (substitua pela sua API real)
  /*const mockData = {
    totalRevenue: 15231.89,
    revenueChange: 2.01,
    totalOrders: 2350,
    ordersChange: 18.01,
    averageTicket: 85.50,
    averageTicketChange: 0.15,
    pendingOrders: 12,
    completedOrders: 234,
    popularItems: [
      { name: "Pizza Margherita", sales: 320 },
      { name: "Hambúrguer Artesanal", sales: 280 },
      { name: "Salada Caesar", sales: 190 },
      { name: "Sushi Variado", sales: 175 },
      { name: "Sobremesa do Chef", sales: 150 }
    ],
    hourlySales: {
      labels: ["10h", "12h", "14h", "16h", "18h", "20h", "22h"],
      data: [1200, 4500, 2200, 1800, 6500, 4800, 2100]
    },
    paymentMethods: {
      labels: ["Cartão", "Dinheiro", "PIX", "Outros"],
      data: [65, 20, 10, 5]
    }
  };*/

  const fetchDashboard = async () => {
  if (!user?.organizationId || !user?.token) return;

  try {
    const res = await apiClient.get(
      `/dash/${user.organizationId}`, // agora o ID vai na rota
      {
        params: {
          startDate,
          endDate,
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    setReport(res.data);
    console.log("Dados retornados",res.data)
  } catch (error) {
    console.error("Erro ao buscar dashboard:", error);
  }
};
useEffect(() => {
    const today = dayjs().format("YYYY-MM-DD");
    setStartDate(today);
    setEndDate(today);
  }, []);

  useEffect(() => {
    if (user) {
      fetchDashboard();
    }
  }, [user, timeRange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDashboard();
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    // Aqui você pode ajustar as datas conforme o intervalo selecionado
  };

  return (
    <Sidebar>
      <Header />
      <div className="bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Visão Geral do Restaurante</h1>
            
            <div className="flex space-x-2 mt-4 md:mt-0">
              <button
                onClick={() => handleTimeRangeChange("today")}
                className={`px-3 py-1 rounded-md text-sm ${timeRange === "today" ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'}`}
              >
                Hoje
              </button>
              <button
                onClick={() => handleTimeRangeChange("week")}
                className={`px-3 py-1 rounded-md text-sm ${timeRange === "week" ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'}`}
              >
                Esta Semana
              </button>
              <button
                onClick={() => handleTimeRangeChange("month")}
                className={`px-3 py-1 rounded-md text-sm ${timeRange === "month" ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'}`}
              >
                Este Mês
              </button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-wrap gap-4 mb-8 items-end bg-white p-4 rounded-lg shadow-sm"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Data Inicial
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-slate-300 rounded-md p-2 text-slate-700 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Data Final
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-slate-300 rounded-md p-2 text-slate-700 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              />
            </div>

            <button
              type="submit"
              className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
            >
              Filtrar
            </button>
          </form>

          {report ? (
            <div className="space-y-6">
              {/* Cards de Métricas Principais */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Faturamento Total"
                  value={`${report.metrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kz`}
                  change={report.revenueChange}
                  icon={<FiDollarSign className="text-slate-600" size={24} />}
                  color="bg-blue-100"
                />
                <MetricCard
                  title="Pedidos"
                  value={report.metrics.totalOrders.toLocaleString()}
                  change={report.ordersChange}
                  icon={<FiCoffee className="text-slate-600" size={24} />}
                  color="bg-green-100"
                />
                <MetricCard
                  title="Ticket Médio"
                  value={`$${report.metrics.averageTicket.toFixed(2)}`}
                  change={report.averageTicketChange}
                  icon={<FiUsers className="text-slate-600" size={24} />}
                  color="bg-purple-100"
                />
                <MetricCard
                  title="Pedidos Pendentes"
                  value={report.metrics.pendingOrders}
                  trend="neutral"
                  icon={<FiClock className="text-slate-600" size={24} />}
                  color="bg-amber-100"
                />
              </div>

              {/* Gráficos e Seções Adicionais */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-slate-800">Vendas por Hora</h2>
                    <select className="border border-slate-300 rounded-md px-3 py-1 text-sm text-slate-700">
                      <option>Hoje</option>
                      <option>Ontem</option>
                      <option>Esta Semana</option>
                    </select>
                  </div>
                  
                    <div className="h-80">
                      <LineChart data={report.charts.hourlySales} />
                    </div>
                  
                </div> 

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-800 mb-4">Métodos de Pagamento</h2>
                  <div className="h-80">
                    <PieChart data={report.charts.paymentMethods} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-800 mb-4">Itens Mais Vendidos</h2>
                  <PopularItems items={report.popularItems} />
                </div>

                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-slate-800">Pedidos Recentes</h2>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Ver Todos
                    </button>
                  </div>
                  <RecentOrdersTable orders={report.recentOrders} />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-500">Carregando dados do dashboard...</p>
          )}
        </div>
      </div>
    </Sidebar>
  );
}