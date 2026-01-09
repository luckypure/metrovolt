import { Zap } from "lucide-react";
import { CONFIG } from "../data/config";
import BookingModal from "./BookingModal";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">

        {/* TOP */}
        <div className="grid lg:grid-cols-4 gap-16 mb-20">

          {/* BRAND */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex gap-2 items-center">
              <div className="bg-indigo-600 p-2 rounded-xl">
                <Zap className="text-white" />
              </div>
              <span className="text-3xl font-black italic">{CONFIG.BRAND}</span>
            </div>

            <p className="text-slate-400 text-lg">
              Architecting the future of urban mobility with sustainable,
              high-performance engineering.
            </p>
          </div>

          {/* INVENTORY */}
          <div>
            <h4 className="text-indigo-400 text-sm font-black uppercase mb-4">
              Inventory
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#models" className="hover:text-white transition-colors">
                  S1 Series
                </a>
              </li>
              <li>
                <a href="#models" className="hover:text-white transition-colors">
                  Pro X
                </a>
              </li>
              <li>
                <a href="#models" className="hover:text-white transition-colors">
                  Terra Volt
                </a>
              </li>
              <li>
                <a href="#models" className="hover:text-white transition-colors">
                  Accessories
                </a>
              </li>
            </ul>
          </div>

          {/* CORPORATE */}
          <div>
            <h4 className="text-indigo-400 text-sm font-black uppercase mb-4">
              Corporate
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#technology" className="hover:text-white transition-colors">
                  Technology
                </a>
              </li>
              <li>
                <a href="#comparison" className="hover:text-white transition-colors">
                  Comparison
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Support
                </a>
              </li>
              <li>
                <a href="/reviews" className="hover:text-white transition-colors">
                  Reviews
                </a>
              </li>
              <li>
                <a href="/test-ride" className="hover:text-white transition-colors">
                  Test Ride
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {CONFIG.BRAND} Corp — All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
