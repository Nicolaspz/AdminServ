import React, { useState, useEffect, useContext } from "react";
import { toast,ToastContainer } from "react-toastify"
import { canSSRAuth } from "../../utils/canSSRAuth"
import { setupAPIClient } from "../../services/api"
import { AuthContext } from "../../contexts/AuthContext";
import { FaMotorcycle, FaChevronUp, FaChevronDown, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

type Fatura = {
  id: string;
  numero: string;
  data_criacao: string;
  data_vencimento: string;
  status: string;
  servicos: Pedido[];
  usuario: {
    proces_number: string;
    tipo_pagamento: string;
  };
};

type Pedido = {
  id: string;
  descricao: string;
  status: string;
  tipo: string;
  Interacao: Interacao[];
};

type Interacao = {
  id: string;
  conteudo: string;
  criado_em: string;
  tipo: string;
};

export default function Concluidos() {
  const [invoices, setInvoices] = useState<Fatura[]>([]);
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);
  const { user } = useContext(AuthContext);
  const apiClient = setupAPIClient();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!user || !user.role) return;

    async function fetchInvoices() {
      try {
        const url = user.role === "ADMIN" ? "/fatura" : `/fatura/${user.id}`;
        const response = await apiClient.get(url, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const filteredInvoices = response.data.filter(
          (fatura: Fatura) => fatura.status === "FECHADA"
        );
        setInvoices(filteredInvoices);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao buscar faturas:", error);
      }
    }

    fetchInvoices();
  }, [user, invoices]);

  const toggleExpand = (faturaId: string) => {
    setExpandedInvoiceId((prev) => (prev === faturaId ? null : faturaId));
  };

  const toggleExpandOrder = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const calculateDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffInTime = due.getTime() - today.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
    return diffInDays;
  };

  const confirmCloseInvoice = async (faturaId: string) => {
    if (window.confirm("Tem certeza de que deseja fechar esta fatura?")) {
      try {
        const response = await apiClient.put(`/fatura/${faturaId}`, {
          status: "FECHADA",
        });

        if (response.status === 200 || response.status === 201) {
          alert("Fatura fechada com sucesso!");
        } else {
          alert("Não foi possível fechar a fatura.");
        }
      } catch (error) {
        alert("Ocorreu um erro ao tentar fechar a fatura. Tente novamente.");
        console.error("Erro ao fechar fatura:", error);
      }
    }
  };

  const renderInvoiceItem = (item: Fatura) => {
    const daysRemaining = calculateDaysRemaining(item.data_vencimento);

    const statusColor = daysRemaining <= 0 
      ? "text-red-400" 
      : daysRemaining <= 2 
        ? "text-yellow-400" 
        : "text-green-400";

    return (
      <div key={item.id} className="bg-gray-800 p-4 rounded-lg mb-4 shadow-md">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-lg font-bold text-white">{item.numero}</span>
            <span className={`text-base font-medium ${statusColor}`}>{item.status}</span>
            <span className="text-green-400">{item.usuario.proces_number}</span>
            <span className="text-green-400">{item.usuario.tipo_pagamento}</span>
          </div>

          <div className="flex items-center gap-4 mb-2">
            <span className={`text-sm font-bold ${statusColor}`}>
              Vencimento: {new Date(item.data_vencimento).toLocaleDateString()}
            </span>
            <span className={`text-sm font-bold ${statusColor}`}>
              {daysRemaining > 0
                ? `${daysRemaining} ${daysRemaining === 1 ? "dia" : "dias"} restantes`
                : daysRemaining === 0
                ? "Vencimento hoje"
                : "Fatura vencida"}
            </span>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => toggleExpand(item.id)} 
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              {expandedInvoiceId === item.id ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
            </button>

            {user.role === 'ADMIN' && (
              <button 
                onClick={() => confirmCloseInvoice(item.id)} 
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <FaCheckCircle size={20} />
              </button>
            )}
          </div>
        </div>

        {expandedInvoiceId === item.id && (
          <div className="mt-4 space-y-3">
            {item.servicos.map((pedido) => (
              <div key={pedido.id} className="bg-gray-700 p-3 rounded-md">
                {pedido.tipo && (
                  <div className="flex items-center gap-2 text-green-400 text-lg font-bold mb-1">
                    <FaMotorcycle />
                    {pedido.tipo === "SERVICO_30_DIAS" ? "SERVIÇO 30 +" : pedido.tipo}
                  </div>
                )}
                <p className="text-white mb-2">{pedido.descricao}</p>
                <button 
                  onClick={() => toggleExpandOrder(pedido.id)} 
                  className="text-green-400 hover:text-green-300 transition-colors mb-2"
                >
                  {expandedOrderId === pedido.id ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
                </button>
                {expandedOrderId === pedido.id && (
                  <div className="space-y-2">
                    {pedido.Interacao.map((interacao) => (
                      <div
                        key={interacao.id}
                        className={`p-2 rounded ${
                          interacao.tipo === "ADMIN" 
                            ? "bg-red-100" 
                            : "bg-blue-100"
                        }`}
                      >
                        <p className="text-gray-800">{interacao.conteudo}</p>
                        <p className="text-gray-500 text-sm">
                          {new Date(interacao.criado_em).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
     );
  };

  return (
    <Sidebar>
      <Header/>
         <div className="min-h-screen bg-gray-900 p-5">
                 {isLoading ? (
                   <div className="flex flex-col items-center justify-center h-screen">
                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
                     <p className="text-white text-lg">Carregando faturas...</p>
                   </div>
                 ) : invoices.length === 0 ? (
                   <div className="flex items-center justify-center h-screen">
                     <p className="text-white text-lg">Não há faturas disponíveis no momento.</p>
                   </div>
                 ) : (
                   <div className="max-w-4xl mx-auto">
                     {invoices.map((invoice) => renderInvoiceItem(invoice))}
                   </div>
                 )}
               </div>
               <ToastContainer />
          
    </Sidebar>
    
  );
}