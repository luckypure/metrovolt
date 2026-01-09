import api from "../utils/api";

export const getReviews = async (scooterId = null) => {
  const params = scooterId ? { scooter: scooterId } : {};
  const res = await api.get("/reviews", { params });
  return res.data;
};

export const addReview = async (reviewData) => {
  const res = await api.post("/reviews", reviewData);
  return res.data;
};

export const updateReview = async (id, reviewData) => {
  const res = await api.put(`/reviews/${id}`, reviewData);
  return res.data;
};

export const deleteReview = async (id) => {
  const res = await api.delete(`/reviews/${id}`);
  return res.data;
};
