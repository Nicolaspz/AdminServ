import React, { useState, useContext } from "react";
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
  const [mesaNumero, setMesaNumero] = useState("");
  const [loading, setLoading] = useState(false);
  const apiClient = setupAPIClient();

  function formatKwanza(value: number): string {
  const inteiro = Math.floor(value * 100); // Transforma em centavos
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
      headStyles: {
        
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 70;
    doc.text(`TOTAL GERAL: ${formatKwanza(data.totalGeral)}`, 5, finalY + 10);
    doc.save(`fatura_mesa_${data.mesaNumero}.pdf`);
  };

  const fecharMesa = async () => {
    if (!mesaNumero) {
      toast.warning("Informe o número da mesa");
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.get(`/close_table/${mesaNumero}`, {
        params: { organizationId: user?.organizationId },
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      gerarFaturaPDF(res.data);
      toast.success("Mesa fechada com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao fechar mesa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
            <title>ServeFixe - Fechar Mesa</title>
      </Head>
    <Sidebar>
      <Header
      title="Fechar mesa"
      />
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-10">
        

        <label className="block text-sm mb-1 text-gray-600">Número da Mesa</label>
        <input
          type="number"
          value={mesaNumero}
          onChange={(e) => setMesaNumero(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
          placeholder="Ex: 5"
        />

        <button
          onClick={fecharMesa}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full disabled:opacity-50"
        >
          {loading ? "Fechando..." : "Fechar e Imprimir Fatura"}
        </button>
      </div>
    </Sidebar> 
    </>  
  );
}
