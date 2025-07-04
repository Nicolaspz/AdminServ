// pages/orders/index.tsx
import React, { useEffect, useState, useContext } from "react";
import { setupAPIClient } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { toast } from "react-toastify";
import { FaEye, FaCheck, FaTimes } from "react-icons/fa";

interface OrderItem {
  id: string;
  amount: number;
  Product: {
    name: string;
  };
}

interface Order {
  id: string;
  name: string;
  created_at: string;
  Session: {
    mesa: {
      number: number;
    };
  };
  items: OrderItem[];
}

export default function OrdersPage() {
  const { user } = useContext(AuthContext);
  const apiClient = setupAPIClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
   const [showConfirm, setShowConfirm] = useState(false);
   const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const fetchOrders = async () => {
    try {
      const response = await apiClient.get("/orders", {
        params: { organizationId: user?.organizationId },
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Erro ao buscar pedidos", error);
      toast.error("Erro ao buscar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExpand = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleCloseOrder = async (order_id: string) => {
    try {
      await apiClient.put("/order/finish", {
        order_id,
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      toast.success("Pedido finalizado com sucesso");
      fetchOrders();
    } catch (error) {
      console.error("Erro ao fechar pedido", error);
      toast.error("Erro ao fechar pedido");
    }
  };

  useEffect(() => {
    if (user?.organizationId) {
      fetchOrders();
    }
  }, [user]);

  return (
    <Sidebar>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Pedidos em Aberto</h1>
        {loading ? (
          <div className="text-center py-10">Carregando...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500">Nenhum pedido em aberto</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white shadow rounded-lg p-4 border">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Mesa {order.Session?.mesa?.number ?? "-"}
                  </h2>
                  <button
                    onClick={() => handleToggleExpand(order.id)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Ver detalhes"
                  >
                    <FaEye />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">Pedido: {order.name}</p>
                <p className="text-sm text-gray-400">Criado em: {new Date(order.created_at).toLocaleString()}</p>

                {expandedOrderId === order.id && (
                  <div className="mt-4">
                    <h3 className="text-md font-medium text-gray-700 mb-2">Itens:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {order.items.map((item) => (
                        <li key={item.id}>
                          {item.amount}x {item.Product.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => handleCloseOrder(order.id)}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2 w-full justify-center"
                >
                  <FaCheck /> Finalizar Pedido
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
    </Sidebar>
  );
}
