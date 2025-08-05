import React, { useEffect, useState, useContext } from "react";
import { setupAPIClient } from "../../../services/api";
import { AuthContext } from "../../../contexts/AuthContext";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import { toast } from "react-toastify";
import { FaEye, FaCheck, FaCheckCircle, FaRegCircle  } from "react-icons/fa";
import Head from "next/head";


interface OrderItem {
  id: string;
  amount: number;
  prepared: boolean;
  Product: {
    id: string;
    name: string;
    categoryId: string;
    Category?: {
      name: string;
    };
  };
}

interface Order {
  id: string;
  name: string;
  created_at: string;
  Session: {
    mesa: {
      number: number;
      Category: {
      name: string;
    };
    };
  };
  items: OrderItem[];
}

export default function OrdersPage() {
  const { user } = useContext(AuthContext);
  const apiClient = setupAPIClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const CATEGORY_FILTER = "comida"; // Altere para "bebida" na outra tela

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get("/orders", {
        params: { organizationId: user?.organizationId },
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      const allOrders: Order[] = response.data;
      console.log("pedidos",response.data.item);
      // Filtro local por categoria
      const filtered = allOrders
        .map((order) => {
          const filteredItems = order.items.filter(
            (item) => item.Product?.Category?.name === CATEGORY_FILTER
          );
          if (filteredItems.length > 0) {
            return { ...order, items: filteredItems };
          }
          return null;
        })
        .filter(Boolean) as Order[];

      setOrders(allOrders);
      setFilteredOrders(filtered);
    } catch (error) {
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
      await apiClient.put(
        "/order/finish",
        { order_id },
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      toast.success("Pedido finalizado com sucesso");
      fetchOrders();
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error); 
      } else {
        toast.error("Erro ao fechar pedido"); 
      }
    }
  };
  

  const togglePrepared = async (itemId: string, prepared: boolean) => {
    try {
      await apiClient.put(
        `/items/${itemId}/toggle-prepared`,
        { prepared },
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      fetchOrders();
    } catch (err) {
      toast.error("Erro ao atualizar item");
    }
  };

  const isAllPrepared = (order: Order) => {
    const fullOrder = orders.find((o) => o.id === order.id);
    if (!fullOrder) return false;
    return fullOrder.items.every((item) => item.prepared);
  };

  useEffect(() => {
    if (user?.organizationId) {
      fetchOrders();
    }
  }, [user]);

  return (
    <>
      <Head>
            <title>ServeFixe - Cozinha</title>
      </Head>
      <Header title="Pedidos da Cozinha" /> 
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {loading ? (
          <div className="text-center py-10">Carregando...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center text-gray-500">
            Nenhum pedido com {CATEGORY_FILTER}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow rounded-lg p-4 border"
              >
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
                <p className="text-sm text-gray-400">
                  Criado em:{" "}
                  {new Date(order.created_at).toLocaleString("pt-PT")}
                </p>

                {expandedOrderId === order.id && (
                  <div className="mt-4">
                    <h3 className="text-md font-medium text-gray-700 mb-2">
                      Itens:
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {order.items.map((item) => (
                          <li key={item.id} className="flex items-center justify-between">
                                                <span>
                                                  {item.amount}x {item.Product.name}
                                                </span>
                                                <button
                                                  onClick={() => togglePrepared(item.id, !item.prepared)}
                                                  title={item.prepared ? "Marcar como não preparado" : "Marcar como preparado"}
                                                >
                                                  {item.prepared ? (
                                                    <FaCheckCircle size={20} className="text-green-600" />
                                                  ) : (
                                                    <FaRegCircle size={20} className="text-gray-400" />
                                                  )}
                                                </button>
                             </li>
                       ))}
                    </ul>
                  </div>
                )}

                {isAllPrepared(order) && (
                  <button
                    onClick={() => handleCloseOrder(order.id)}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2 w-full justify-center"
                  >
                    <FaCheck /> Fechar Pedido
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
