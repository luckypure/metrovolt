import api from "../utils/api";

export const createBooking = async (bookingData) => {
  const res = await api.post("/bookings", bookingData);
  return res.data;
};

export const getUserBookings = async () => {
  const res = await api.get("/bookings/my");
  return res.data;
};

export const getAllBookings = async () => {
  const res = await api.get("/bookings");
  return res.data;
};

export const getBooking = async (id) => {
  const res = await api.get(`/bookings/${id}`);
  return res.data;
};

export const updateBookingStatus = async (id, status) => {
  const res = await api.put(`/bookings/${id}`, { status });
  return res.data;
};

export const deleteBooking = async (id) => {
  const res = await api.delete(`/bookings/${id}`);
  return res.data;
};
