import React, { useContext, useEffect, useState } from "react";
import { FiDollarSign, FiCoffee, FiUsers, FiClock } from "react-icons/fi";
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
import Head from "next/head";

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
  const { user, isAuthenticated } = useContext(AuthContext);
  const [report, setReport] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<string>("today");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const apiClient = setupAPIClient();

  // Função para calcular o range de datas
  const getDateRange = (range: string) => {
    const today = dayjs();
    switch (range) {
      case "today":
        return {
          startDate: today.format("YYYY-MM-DD"),
          endDate: today.format("YYYY-MM-DD")
        };
      case "week":
        return {
          startDate: today.startOf('week').format("YYYY-MM-DD"),
          endDate: today.endOf('week').format("YYYY-MM-DD")
        };
      case "month":
        return {
          startDate: today.startOf('month').format("YYYY-MM-DD"),
          endDate: today.endOf('month').format("YYYY-MM-DD")
        };
      default:
        return {
          startDate: today.format("YYYY-MM-DD"),
          endDate: today.format("YYYY-MM-DD")
        };
    }
  };

  const [dateRange, setDateRange] = useState(getDateRange(timeRange));

  const fetchDashboard = async () => {
    if (!user?.organizationId || !user?.token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);
    
    try {
      const res = await apiClient.get(
        `/dash/${user.organizationId}`,
        {
          params: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          },
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setReport(res.data);
    } catch (error) {
      console.error("Erro ao buscar dashboard:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Atualiza o dateRange quando timeRange muda
  useEffect(() => {
    setDateRange(getDateRange(timeRange));
  }, [timeRange]);

  // Monitora mudanças na autenticação e no dateRange
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchDashboard();
    }
  }, [isAuthenticated, user, dateRange]);

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

  // Se não estiver autenticado, mostra loading
  if (!isAuthenticated) {
    return (
      <Sidebar>
        <Header title="Dashboard" />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Sidebar>
    );
  }

  return (
    <>
      <Head>
        <title>ServeFixe - Dashboard</title>
      </Head>
       <Sidebar>
      <Header title="Dashboard" />
      <div className="bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            
            
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

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : hasError ? (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <p className="text-slate-500 mb-4">Erro ao carregar os dados do dashboard</p>
              <button
                onClick={fetchDashboard}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Tentar novamente
              </button>
            </div>
          ) : report ? (
            <div className="space-y-6">
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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-slate-800">Vendas por Hora</h2>
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
                  </div>
                  <RecentOrdersTable orders={report.recentOrders} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <p className="text-slate-500 mb-4">Nenhum dado disponível</p>
              <button
                onClick={fetchDashboard}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Carregar dados
              </button>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
    </>
   
  );
}