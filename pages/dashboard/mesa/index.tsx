import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { setupAPIClient } from "../../../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import Head from "next/head";

export default function FecharMesa() {
  const { user } = useContext(AuthContext);
  const [mesasAbertas, setMesasAbertas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const apiClient = setupAPIClient();

  function formatKwanza(value: number): string {
    const inteiro = Math.floor(value * 100);
    return inteiro.toLocaleString("pt-AO") + ",00 Kz";
  }

  const gerarFaturaPDF = (data: any) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 150],
    });

    doc.setFontSize(10);
    doc.text("RESTAURANTE XPTO", 40, 6, { align: "center" });
    doc.setFontSize(8);
    doc.text(`Mesa: ${data.mesaNumero}`, 5, 15);
    doc.text(`Abertura: ${new Date(data.abertaEm).toLocaleTimeString()}`, 5, 20);
    doc.text(`Fechada: ${new Date(data.fechadaEm).toLocaleTimeString()}`, 5, 25);
    doc.text("FATURA NÃO PAGA", 5, 30);

    autoTable(doc, {
      startY: 35,
      head: [["Produto", "Qtd", "Unit.", "Subtotal"]],
      body: data.pedidos.flatMap((pedido: any) =>
        pedido.items.map((item: any) => [
          item.produto,
          item.quantidade,
          formatKwanza(item.precoUnitario),
          formatKwanza(item.subtotal),
        ])
      ),
      styles: {
        fontSize: 8,
        cellPadding: 1,
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 70;
    doc.text(`TOTAL GERAL: ${formatKwanza(data.totalGeral)}`, 5, finalY + 10);
    doc.save(`fatura_mesa_${data.mesaNumero}.pdf`);
  };

  const fecharMesa = async (mesaNumero: string) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/close_table/${mesaNumero}`, {
        params: { organizationId: user?.organizationId },
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      gerarFaturaPDF(res.data);
      toast.success(`Mesa ${mesaNumero} fechada com sucesso!`);
      trazerMesas();
    } catch (error: any) {
      toast.error("Erro ao fechar mesa");
    } finally {
      setLoading(false);
    }
  };

  const trazerMesas = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const res = await apiClient.get(`/mesaOpened/${user.organizationId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMesasAbertas(res.data);
    } catch (error: any) {
      toast.error("Erro ao carregar mesas abertas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.organizationId) {
      trazerMesas();
    }
  }, [user]);

  return (
    <>
      <Head>
            <title>ServeFixe - Mesas Abertas</title>
      </Head>
    <Sidebar>
      <Header title="Mesas Abertas"/>
    <div className="bg-gray-900 text-slate-200 min-h-screen p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Mesas Abertas</h2>

      {loading && <p className="text-center text-slate-400">Carregando...</p>}

      {!loading && mesasAbertas.length === 0 && (
        <p className="text-center text-slate-400">Nenhuma mesa aberta.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {!loading &&
          mesasAbertas.map((mesa: any) => (
            <div
              key={mesa.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col justify-between shadow"
            >
              <div>
                <p className="text-lg font-bold mb-1">Mesa {mesa.number}</p>
                <p className="text-sm text-slate-400">
                  Abertura: {new Date(mesa.abertaEm).toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={() => fecharMesa(mesa.numero)}
                disabled={loading}
                className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-3 py-2 rounded transition disabled:opacity-50"
              >
                {loading ? "Fechando..." : "Fechar & Imprimir"}
              </button>
            </div>
          ))}
      </div>
      </div>
      </Sidebar>
    </>
  );
}
