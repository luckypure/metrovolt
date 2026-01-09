import api from "../utils/api";

export const bookTestRide = async (rideData) => {
  const res = await api.post("/test-ride", rideData);
  return res.data;
};
