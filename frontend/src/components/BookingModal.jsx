import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { createBooking } from "../services/bookingService";
import { getNearestShowrooms, getShowrooms } from "../services/showroomService";
import { X, MapPin, Calendar, Clock, User, Mail, Phone, MessageSquare } from "lucide-react";
import Button from "./Button";

export default function BookingModal({ scooter, isOpen, onClose, onSuccess, cartManager }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // If user is already logged in, skip the login step and go directly to showroom selection
  const [step, setStep] = useState(isAuthenticated ? 2 : 1); // 1: Login check, 2: Showroom, 3: Booking form, 4: Success
  const [showrooms, setShowrooms] = useState([]);
  const [selectedShowroom, setSelectedShowroom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    bookingDate: "",
    bookingTime: "",
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    notes: ""
  });

  useEffect(() => {
    if (!isOpen) return;

    // If user is authenticated, ensure we are on showroom step
    if (isAuthenticated && step === 1) {
      setStep(2);
    }

    if (step === 2) {
      loadShowrooms();
    }

    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || ""
      }));
    }
  }, [isOpen, step, user, isAuthenticated]);

  async function loadShowrooms() {
    try {
      setLoading(true);
      setError("");
      // Try to get nearest showrooms first
      let data = await getNearestShowrooms();
      
      // If no nearest showrooms, get all showrooms as fallback
      if (!data || data.length === 0) {
        data = await getShowrooms();
      }
      
      setShowrooms(data || []);
      if (data && data.length > 0) {
        setSelectedShowroom(data[0]);
      }
    } catch (err) {
      console.error("Error loading showrooms:", err);
      // Try fallback to all showrooms
      try {
        const allData = await getShowrooms();
        setShowrooms(allData || []);
        if (allData && allData.length > 0) {
          setSelectedShowroom(allData[0]);
        }
      } catch {
        setError("Failed to load showrooms. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleNext = () => {
    if (step === 1) {
      if (!isAuthenticated) {
        navigate("/login", { state: { returnTo: window.location.pathname } });
        onClose();
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedShowroom) {
        setError("Please select a showroom");
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.bookingDate || !formData.bookingTime || !formData.phone) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const bookingData = {
        scooter: scooter._id,
        showroom: {
          name: selectedShowroom.name,
          address: selectedShowroom.address,
          city: selectedShowroom.city,
          phone: selectedShowroom.phone,
          email: selectedShowroom.email
        },
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime,
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        notes: formData.notes
      };

      const newBooking = await createBooking(bookingData);
      
      // Add to cart
      if (cartManager) {
        cartManager.addItem({
          type: 'booking',
          id: newBooking._id,
          scooter: scooter,
          bookingDate: formData.bookingDate,
          bookingTime: formData.bookingTime,
          showroom: selectedShowroom,
          price: 0
        });
      }

      setStep(4);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book ride. Please try again.");
      console.error("Booking error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-black">Book a Test Ride</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Step 1: Login Check */}
          {step === 1 && (
            <div className="text-center py-8">
              <div className="mb-6">
                <h3 className="text-xl font-black mb-2">Login Required</h3>
                <p className="text-slate-600">
                  Please login to book a test ride
                </p>
              </div>
              {!isAuthenticated ? (
                <div className="space-y-4">
                  <Button
                    onClick={() => {
                      navigate("/login", { state: { returnTo: window.location.pathname } });
                      onClose();
                    }}
                    className="w-full"
                  >
                    Go to Login
                  </Button>
                  <button
                    onClick={onClose}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <Button onClick={handleNext} className="w-full">
                  Continue
                </Button>
              )}
            </div>
          )}

          {/* Step 2: Showroom Selection */}
          {step === 2 && (
            <div>
              <h3 className="text-xl font-black mb-4">Select Nearest Showroom</h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p>Loading showrooms...</p>
                </div>
              ) : showrooms.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-600 mb-4">No showrooms available at the moment.</p>
                  {error && (
                    <p className="text-rose-600 text-sm">{error}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {showrooms.map((showroom) => (
                    <button
                      key={showroom.id}
                      onClick={() => setSelectedShowroom(showroom)}
                      className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                        selectedShowroom?.id === showroom.id
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-slate-200 hover:border-indigo-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="text-indigo-600 mt-1" size={20} />
                        <div className="flex-1">
                          <h4 className="font-black mb-1">{showroom.name}</h4>
                          <p className="text-sm text-slate-600">{showroom.address}</p>
                          <p className="text-sm text-slate-600">{showroom.city}, {showroom.state} {showroom.zipCode}</p>
                          {showroom.phone && (
                            <p className="text-sm text-slate-500 mt-1">📞 {showroom.phone}</p>
                          )}
                          {showroom.distance && (
                            <p className="text-xs text-indigo-600 mt-1">
                              📍 {showroom.distance.toFixed(1)} km away
                            </p>
                          )}
                        </div>
                        {selectedShowroom?.id === showroom.id && (
                          <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300"
                >
                  Back
                </button>
                <Button
                  onClick={handleNext}
                  disabled={!selectedShowroom}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Booking Form */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-xl font-black mb-4">Booking Details</h3>

              {error && (
                <div className="p-4 bg-rose-100 border border-rose-300 text-rose-700 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Selected Showroom Info */}
              {selectedShowroom && (
                <div className="p-4 bg-indigo-50 rounded-xl mb-4">
                  <p className="text-sm font-bold text-indigo-900 mb-1">Selected Showroom:</p>
                  <p className="text-sm text-indigo-700">{selectedShowroom.name}</p>
                  <p className="text-xs text-indigo-600">{selectedShowroom.address}, {selectedShowroom.city}</p>
                </div>
              )}

              {/* Scooter Info */}
              <div className="p-4 bg-slate-50 rounded-xl mb-4">
                <p className="text-sm font-bold text-slate-900 mb-1">Scooter:</p>
                <p className="text-sm text-slate-700">{scooter.name} - ${scooter.price}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Booking Date *
                  </label>
                  <input
                    type="date"
                    value={formData.bookingDate}
                    onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    <Clock size={16} className="inline mr-1" />
                    Booking Time *
                  </label>
                  <select
                    value={formData.bookingTime}
                    onChange={(e) => setFormData({ ...formData, bookingTime: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Time</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <User size={16} className="inline mr-1" />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <Mail size={16} className="inline mr-1" />
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <Phone size={16} className="inline mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <MessageSquare size={16} className="inline mr-1" />
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                  placeholder="Any special requirements or questions..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-black mb-2">Booking Confirmed!</h3>
              <p className="text-slate-600 mb-6">
                Your test ride has been booked and added to "My Bag".
              </p>
              <div className="space-y-3">
                <Button onClick={onClose} className="w-full">
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
