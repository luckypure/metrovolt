import React from "react";
import { Route } from "react-router-dom";

import Login from "../pages/Login";
import Logout from "../pages/Logout";

export const authRoutes = [
  <Route key="login" path="/login" element={<Login />} />,
  <Route key="logout" path="/logout" element={<Logout />} />,
];
