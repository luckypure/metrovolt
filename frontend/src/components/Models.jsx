import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import Reveal from "./Reveal";
import BookingModal from "./BookingModal";
import { getScooters } from "../services/scooterService";
import { useAuth } from "../hooks/useAuth";

export default function Models({ cartManager }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedColors, setSelectedColors] = useState({});
  const [loading, setLoading] = useState(true);
  const [bookingModal, setBookingModal] = useState({ isOpen: false, scooter: null });

  useEffect(() => {
    async function load() {
      try {
        const data = await getScooters();
        setProducts(data);

        // default select first color for each product
        const defaults = {};
        data.forEach(p => {
          defaults[p._id] = p.colors?.[0] || "#000";
        });
        setSelectedColors(defaults);

      } catch (err) {
        console.error("Error loading scooters:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading)
    return (
      <section className="py-32 text-center text-xl font-black">
        Loading scooters...
      </section>
    );

  return (
    <section id="models" className="py-32">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-5xl font-black text-center mb-16">
          Elite Series
        </h2>

        <div className="grid lg:grid-cols-3 gap-10">

          {products.map((m, i) => (
            <Reveal key={m._id} delay={i * 100}>
              <div 
                className="p-8 rounded-3xl border bg-white shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                onClick={() => navigate(`/scooter/${m._id}`)}
              >

                {/* PRODUCT IMAGE */}
                {m.images && m.images.length > 0 ? (
                  <div className="mb-4 rounded-2xl overflow-hidden">
                    <img
                      src={`http://localhost:5000${m.images[0]}`}
                      alt={m.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                  </div>
                ) : (
                  <div className="mb-4 w-full h-48 bg-indigo-100 rounded-2xl flex items-center justify-center">
                    <span className="text-slate-400">No Image</span>
                  </div>
                )}

                {/* PRODUCT NAME */}
                <h3 className="text-3xl font-black">
                  {m.name}
                </h3>

                {/* PRICE */}
                <p className="text-indigo-600 font-black text-lg mt-2">
                  ${m.price}
                </p>

                {/* DESCRIPTION */}
                {m.description && (
                  <p className="text-sm text-slate-500 mt-3">
                    {m.description}
                  </p>
                )}

                {/* FEATURES */}
                {m.features && m.features.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-bold text-slate-700 mb-2">Features:</p>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {m.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-1">
                          <span className="text-indigo-600">✓</span>
                          {feature}
                        </li>
                      ))}
                      {m.features.length > 3 && (
                        <li className="text-slate-400">+{m.features.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}

                {/* SPECS */}
                <div className="mt-6 text-sm text-slate-600 space-y-1">
                  {m?.specs?.speed && <p>⚡ Speed: {m.specs.speed}</p>}
                  {m?.specs?.range && <p>🔋 Range: {m.specs.range}</p>}
                  {m?.specs?.motor && <p>⚙ Motor: {m.specs.motor}</p>}
                  {m?.specs?.weight && <p>⚖ Weight: {m.specs.weight}</p>}
                </div>

                {/* COLORS */}
                {m.colors && m.colors.length > 0 && (
                  <div className="flex gap-2 mt-6">
                    {m.colors.map((c) => (
                      <button
                        key={c}
                        className={`w-8 h-8 rounded-full border ${
                          selectedColors[m._id] === c
                            ? "ring-4 ring-indigo-400"
                            : ""
                        }`}
                        style={{ background: c }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedColors((prev) => ({
                            ...prev,
                            [m._id]: c,
                          }));
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* BOOK A RIDE */}
                <Button
                  className="w-full mt-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!user) {
                      navigate("/login", { state: { returnTo: "/models" } });
                      return;
                    }
                    setBookingModal({ isOpen: true, scooter: m });
                  }}
                >
                  Book a Ride
                </Button>

              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModal.isOpen && (
        <BookingModal
          scooter={bookingModal.scooter}
          isOpen={bookingModal.isOpen}
          onClose={() => setBookingModal({ isOpen: false, scooter: null })}
          cartManager={cartManager}
          onSuccess={() => {
            // Keep open to show success message
          }}
        />
      )}
    </section>
  );
}
