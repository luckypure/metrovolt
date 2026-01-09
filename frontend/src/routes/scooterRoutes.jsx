import React from "react";
import { Route } from "react-router-dom";

import Home from "../pages/Home";

export const scooterRoutes = [
  <Route key="home" path="/" element={<Home />} />,
];
