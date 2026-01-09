import React from "react";
import { Route } from "react-router-dom";

import ReviewService from "../components/ReviewService";
import TestRideService from "../components/TestRideService";

export const reviewRoutes = [
  <Route key="reviews" path="/reviews" element={<ReviewService />} />,
  <Route key="test-ride" path="/test-ride" element={<TestRideService />} />,
];
