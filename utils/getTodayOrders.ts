export function getTodayOrders(orders: Order[]): Order[] {
  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

  return orders.filter((order) => {
    const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
    return orderDate === today;
  });
}