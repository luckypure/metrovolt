import React from "react";
import { Route } from "react-router-dom";

import AdminDashboard from "../pages/AdminDashboard";
import AdminMiddleware from "../middleware/adminMiddleware";

export const orderRoutes = [
  <Route
    key="admin"
    path="/admin"
    element={
      <AdminMiddleware>
        <AdminDashboard />
      </AdminMiddleware>
    }
  />,
];
