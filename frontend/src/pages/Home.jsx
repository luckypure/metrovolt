import { useCart } from "../hooks/useCart";
import Navbar from "../components/Navbar";
import CartDrawer from "../components/CartDrawer";
import Hero from "../components/Hero";
import Models from "../components/Models";
import Comparison from "../components/Comparison";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";

export default function Home() {
  const cartManager = useCart();

  return (
    <div className="bg-white text-slate-900">
      <Navbar cartManager={cartManager} />
      <CartDrawer cartManager={cartManager} />
      <Hero />
      <Models cartManager={cartManager} />
      <Comparison />
      <FAQ />
      <Footer />
    </div>
  );
}
