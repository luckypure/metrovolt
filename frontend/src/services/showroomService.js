import api from "../utils/api";

export const getShowrooms = async () => {
  const res = await api.get("/showrooms");
  return res.data;
};

export const getNearestShowrooms = async (city = null, latitude = null, longitude = null) => {
  const params = {};
  if (city) params.city = city;
  if (latitude) params.latitude = latitude;
  if (longitude) params.longitude = longitude;
  
  const res = await api.get("/showrooms/nearest", { params });
  return res.data;
};
