export const isEmailValid = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isPasswordStrong = (password) =>
  password.length >= 6;

export const isRequired = (value) =>
  value !== null && value !== undefined && value !== "";
