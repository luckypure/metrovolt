import React from "react";
import { Route } from "react-router-dom";
import AdminDashboard from "../pages/AdminDashboard";

export const adminRoutes = [
  <Route key="admin" path="/admin" element={<AdminDashboard />} />,
];
