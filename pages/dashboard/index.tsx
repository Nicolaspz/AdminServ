import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { AuthContext } from "../../contexts/AuthContext";
import { setupAPIClient } from "../../services/api";
import dayjs from "dayjs";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [report, setReport] = useState<any>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const apiClient = setupAPIClient();
  
  const fetchDashboard = async () => {
    try {
      const res = await apiClient.get("/dashboard", {
        params: {
          organizationId: user?.organizationId,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
      });
      setReport(res.data);
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
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDashboard();
  };

  return (
    <Sidebar>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-4 mb-8 items-end"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data Inicial
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data Final
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Filtrar
          </button>
        </form>

        {report ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card title="Total de Compras" value={formatKz(report.totalCompras)} />
              <Card title="Total de Vendas" value={formatKz(report.totalVendas)} />
              <Card title="Lucro" value={formatKz(report.lucro)} />
              <Card title="Margem de Lucro (%)" value={report.margemLucro.toFixed(2) + "%"} />
              <Card title="Produtos Comprados" value={report.qtdProdutosComprados} />
              <Card title="Produtos Vendidos" value={report.qtdProdutosVendidos} />
              <Card title="Faturas Pendentes" value={report.faturasPendentes} />
              <Card title="Valor em Aberto" value={formatKz(report.valorFaturasPendentes)} />
            </div>

            {/* Exemplo de futura tabela com vendas ou compras detalhadas */}
            {/* <TabelaVendas vendas={report.vendas} /> */}
          </>
        ) : (
          <p className="text-gray-500">Carregando dados do dashboard...</p>
        )}
      </div>
    </Sidebar>
  );
}

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white p-4 shadow-md rounded-xl">
      <h2 className="text-sm text-gray-600">{title}</h2>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}

function formatKz(value: number): string {
  return `Kz ${value.toFixed(2).replace(".", ",")}`;
}
