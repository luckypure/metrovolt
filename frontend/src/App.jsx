import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useState, useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminMiddleware from "./middleware/adminMiddleware";

// Components
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import Hero from "./components/Hero";
import Models from "./components/Models";
import Comparison from "./components/Comparison";
import Technology from "./components/Technology";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import AdminDashboard from "./pages/AdminDashboard";
import ContentManagement from "./pages/ContentManagement";
import ScooterDetail from "./pages/ScooterDetail";
import ReviewService from "./components/ReviewService";
import TestRideService from "./components/TestRideService";

import { useCart } from "./hooks/useCart";

// Layout component for pages with navbar/footer
function Layout({ children, cartManager }) {
  return (
    <div className="bg-white text-slate-900">
      <Navbar cartManager={cartManager} />
      <CartDrawer cartManager={cartManager} />
      {children}
      <Footer />
    </div>
  );
}

// Home page with all sections
function HomePage({ cartManager }) {
  return (
    <Layout cartManager={cartManager}>
      <Hero />
      <Models cartManager={cartManager} />
      <Technology />
      <Comparison />
      <FAQ />
    </Layout>
  );
}

function App() {
  const cartManager = useCart();

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage cartManager={cartManager} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/scooter/:id" element={<Layout cartManager={cartManager}><ScooterDetail cartManager={cartManager} /></Layout>} />
          <Route path="/reviews" element={<Layout cartManager={cartManager}><ReviewService /></Layout>} />
          <Route path="/test-ride" element={<Layout cartManager={cartManager}><TestRideService /></Layout>} />

          {/* Protected Routes */}
          <Route
            path="/logout"
            element={
              <ProtectedRoute>
                <Logout />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminMiddleware>
                <Layout cartManager={cartManager}>
                  <AdminDashboard />
                </Layout>
              </AdminMiddleware>
            }
          />
          <Route
            path="/admin/content"
            element={
              <AdminMiddleware>
                <Layout cartManager={cartManager}>
                  <ContentManagement />
                </Layout>
              </AdminMiddleware>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
