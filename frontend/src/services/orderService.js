import api from "../utils/api";

export const placeOrder = async (orderData) => {
  const res = await api.post("/orders", orderData);
  return res.data;
};

export const getUserOrders = async () => {
  const res = await api.get("/orders/my");
  return res.data;
};

export const getAllOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

export const updateOrderStatus = async (id, status) => {
  const res = await api.put(`/orders/${id}`, { status });
  return res.data;
};
