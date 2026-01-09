import api from "../utils/api";

export const sendOTP = async (email) => {
  const res = await api.post("/otp/send", { email });
  return res.data;
};

export const verifyOTP = async (email, otp) => {
  const res = await api.post("/otp/verify", { email, otp });
  return res.data;
};

export const checkVerification = async (email) => {
  const res = await api.post("/otp/check", { email });
  return res.data;
};
