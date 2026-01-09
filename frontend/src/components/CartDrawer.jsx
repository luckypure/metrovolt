import { useState } from "react";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Calendar, Check } from "lucide-react";
import Button from "./Button";
import ReviewModal from "./ReviewModal";
import { CONFIG } from "../data/config";

export default function CartDrawer({ cartManager }) {
  const [reviewModal, setReviewModal] = useState({ isOpen: false, scooterId: null, bookingId: null });

  return (
    <>
      <div
        className={`fixed inset-0 z-50 ${
          cartManager.isOpen ? "visible" : "invisible"
        }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => cartManager.setIsOpen(false)}
        />

        {/* Drawer */}
        <aside className={`absolute right-0 top-0 h-full max-w-md w-full bg-white shadow-2xl transition-all duration-700 ease-[cubic-bezier(.21,1,.22,1)] ${cartManager.isOpen ? "translate-x-0" : "translate-x-full"}`}>
          <header className="p-6 border-b flex justify-between items-center">
            <h2 className="text-2xl font-black flex gap-2">
              <ShoppingBag /> My Bag
            </h2>
            <button onClick={() => cartManager.setIsOpen(false)}>
              <X />
            </button>
          </header>

          <div className="p-6 space-y-6 overflow-y-auto h-[70vh]">
            {cartManager.cart.length === 0 && (
              <p className="opacity-40 text-center">Bag is empty</p>
            )}

            {cartManager.cart.map((item) => {
              if (item.type === 'booking') {
                return (
                  <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-20 h-20 rounded-2xl bg-indigo-100 flex justify-center items-center text-indigo-600 shrink-0">
                      <Calendar size={32} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black truncate">{item.scooter.name}</h4>
                      <p className="text-xs text-indigo-600 font-bold uppercase mb-1">Test Ride Booking</p>
                      <p className="text-sm font-bold">{item.bookingDate}</p>
                      <p className="text-sm text-slate-500 mb-2">{item.bookingTime}</p>
                      <p className="text-xs text-slate-400 truncate">{item.showroom.name}</p>
                      
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200">
                         <button 
                           onClick={() => setReviewModal({ isOpen: true, scooterId: item.scooter._id, bookingId: item.id })}
                           className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-1"
                         >
                           <Check size={12} /> Complete & Review
                         </button>
                         <button 
                           onClick={() => cartManager.removeItem(item.id)}
                           className="p-1 hover:bg-rose-50 rounded text-rose-500 transition-colors"
                         >
                            <Trash2 size={16} />
                         </button>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={item.id + item.color} className="flex gap-4">
                  <div
                    className={`w-20 h-20 rounded-2xl ${CONFIG.COLORS[item.color]?.class || 'bg-slate-900'} flex justify-center items-center text-white shrink-0`}
                  >
                    <item.icon />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-black">{item.name}</h4>
                    <p className="text-xs uppercase text-slate-400">
                      {item.color}
                    </p>

                    <div className="flex justify-between mt-2">
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() =>
                            cartManager.updateQty(item.id, item.color, -1)
                          }
                        >
                          <Minus size={12} />
                        </button>
                        <span>{item.qty}</span>
                        <button
                          onClick={() =>
                            cartManager.updateQty(item.id, item.color, 1)
                          }
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          cartManager.removeItem(item.id, item.color)
                        }
                      >
                        <Trash2 className="text-rose-500" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {cartManager.cart.length > 0 && (
            <footer className="p-6 border-t space-y-4">
              <div className="flex justify-between font-black text-xl">
                <span>Total</span>
                <span>${cartManager.total}</span>
              </div>

              <Button className="w-full">
                Checkout <ArrowRight />
              </Button>
            </footer>
          )}
        </aside>
      </div>

      <ReviewModal 
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal({ ...reviewModal, isOpen: false })}
        scooterId={reviewModal.scooterId}
        bookingId={reviewModal.bookingId}
        onSuccess={() => {
           // Optional: Remove the booking after review?
           // For now, keep it or maybe mark as reviewed if we tracked that state locally
           // cartManager.removeItem(reviewModal.bookingId);
        }}
      />
    </>
  );
}
