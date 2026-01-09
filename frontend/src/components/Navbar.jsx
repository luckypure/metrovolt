import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Menu, X, ShoppingBag, User, LogOut, Shield } from "lucide-react";
import Button from "./Button";
import { CONFIG } from "../data/config";
import { useAuth } from "../hooks/useAuth";

export default function Navbar({ cartManager }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-700 ${
          isScrolled ? "glass shadow-2xl glow h-16" : "bg-transparent h-24"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">

          {/* BRAND */}
          <Link
            to="/"
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg">
              <Zap className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black italic text-indigo-900">
              {CONFIG.BRAND}
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-8">
            {CONFIG.NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="uppercase text-[10px] font-black tracking-[0.2em] text-slate-500 hover:text-indigo-600"
              >
                {l.label}
              </a>
            ))}

            <button onClick={() => cartManager.setIsOpen(true)} className="relative">
              <ShoppingBag />
              {!!cartManager.cart.length && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black">
                  {cartManager.cart.length}
                </span>
              )}
            </button>

            {user ? (
              <>
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 text-xs"
                    >
                      <Shield size={16} />
                      Admin
                    </Link>
                    <Link
                      to="/admin/content"
                      className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-xl font-bold hover:bg-slate-700 text-xs"
                    >
                      <Shield size={16} />
                      CMS
                    </Link>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-700">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 text-xs"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 text-xs"
              >
                <User size={16} />
                Login
              </Link>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button className="p-2 lg:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* ⭐ MOBILE MENU PANEL (WORKING) ⭐ */}
      <div
        className={`lg:hidden fixed top-16 left-0 w-full z-40 bg-white shadow-2xl
        transition-all duration-500
        ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5 pointer-events-none"}`}
      >
        <div className="p-8 space-y-6">

          {CONFIG.NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={(e) => {
                setOpen(false);
                if (l.href.startsWith("#")) {
                  e.preventDefault();
                  const element = document.querySelector(l.href);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }
              }}
              className="block text-3xl font-black italic text-slate-800 hover:text-indigo-600"
            >
              {l.label}
            </a>
          ))}

          <button
            onClick={() => {
              cartManager.setIsOpen(true);
              setOpen(false);
            }}
            className="w-full bg-slate-200 py-4 rounded-xl font-black"
          >
            View Bag ({cartManager.cart.length})
          </button>

          {user ? (
            <>
              {isAdmin && (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="block w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-center mb-2"
                  >
                    Admin Panel
                  </Link>
                  <Link
                    to="/admin/content"
                    onClick={() => setOpen(false)}
                    className="block w-full bg-slate-600 text-white py-4 rounded-xl font-black text-center mb-2"
                  >
                    Content Management
                  </Link>
                </>
              )}
              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-2">Logged in as:</p>
                <p className="font-bold text-slate-900">{user.name}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-rose-500 text-white py-4 rounded-xl font-black"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="block w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-center"
            >
              Login / Sign Up
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
