import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getScooter, getScooters } from "../services/scooterService";
import { getReviews, addReview, updateReview } from "../services/reviewService";
import { useAuth } from "../hooks/useAuth";
import { Star, ArrowLeft, Calendar, Check, X } from "lucide-react";
import Button from "../components/Button";
import BookingModal from "../components/BookingModal";

export default function ScooterDetail({ cartManager }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [scooter, setScooter] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [suggestedItems, setSuggestedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [existingReview, setExistingReview] = useState(null);

  useEffect(() => {
    if (user && reviews.length > 0) {
      // Check both id and _id to be safe depending on backend response
      const found = reviews.find(r => 
        (r.user?._id === user.id) || (r.user?._id === user._id)
      );
      setExistingReview(found || null);
    } else {
      setExistingReview(null);
    }
  }, [user, reviews]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [scooterData, allScooters, reviewsData] = await Promise.all([
        getScooter(id),
        getScooters(),
        getReviews(id) // Pass scooter ID to filter reviews
      ]);

      setScooter(scooterData);
      setSelectedColor(scooterData.colors?.[0] || "");

      // Reviews are already filtered by backend
      setReviews(reviewsData);

      // Get suggested items (other scooters, exclude current)
      const suggested = allScooters
        .filter(s => s._id !== id)
        .slice(0, 4);
      setSuggestedItems(suggested);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);
  
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBookRide = () => {
    setShowBookingModal(true);
  };

  const handleToggleReviewForm = () => {
    if (!showReviewForm) {
      if (existingReview) {
        setIsEditing(true);
        setReviewForm({
          rating: existingReview.rating,
          comment: existingReview.comment
        });
      } else {
        setIsEditing(false);
        setReviewForm({ rating: 5, comment: "" });
      }
    }
    setShowReviewForm(!showReviewForm);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please login to submit a review");
      navigate("/login");
      return;
    }

    try {
      if (isEditing && existingReview) {
        await updateReview(existingReview._id, {
          rating: reviewForm.rating,
          comment: reviewForm.comment
        });
      } else {
        await addReview({
          scooter: id,
          rating: reviewForm.rating,
          comment: reviewForm.comment
        });
      }
      setReviewForm({ rating: 5, comment: "" });
      setShowReviewForm(false);
      setIsEditing(false);
      await loadData(); // Reload reviews
    } catch (err) {
      console.error("Error submitting review:", err);
      alert(err.response?.data?.message || "Failed to submit review");
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-700 font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!scooter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-black mb-4">Scooter not found</p>
          <Link to="/" className="text-indigo-600 hover:text-indigo-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Main Product Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            {scooter.images && scooter.images.length > 0 ? (
              <>
                <div className="mb-4 rounded-2xl overflow-hidden">
                  <img
                    src={`http://localhost:5000${scooter.images[selectedImageIndex]}`}
                    alt={scooter.name}
                    className="w-full h-96 object-cover"
                  />
                </div>
                {scooter.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {scooter.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`rounded-lg overflow-hidden border-2 ${
                          selectedImageIndex === idx
                            ? "border-indigo-600"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={`http://localhost:5000${img}`}
                          alt={`${scooter.name} ${idx + 1}`}
                          className="w-full h-20 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-96 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <span className="text-slate-400">No Image</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-5xl font-black mb-4">{scooter.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className={
                      star <= averageRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-300"
                    }
                  />
                ))}
              </div>
              <span className="text-slate-600">
                {averageRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>

            <p className="text-4xl font-black text-indigo-600 mb-6">
              ${scooter.price}
            </p>

            {scooter.description && (
              <p className="text-slate-600 mb-6">{scooter.description}</p>
            )}

            {/* Features */}
            {scooter.features && scooter.features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-black mb-3">Key Features:</h3>
                <ul className="space-y-2">
                  {scooter.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check size={18} className="text-emerald-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specs */}
            {scooter.specs && (
              <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                <h3 className="font-black mb-3">Specifications:</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {scooter.specs.speed && (
                    <div>
                      <span className="text-slate-500">Speed:</span>{" "}
                      <span className="font-bold">{scooter.specs.speed}</span>
                    </div>
                  )}
                  {scooter.specs.range && (
                    <div>
                      <span className="text-slate-500">Range:</span>{" "}
                      <span className="font-bold">{scooter.specs.range}</span>
                    </div>
                  )}
                  {scooter.specs.motor && (
                    <div>
                      <span className="text-slate-500">Motor:</span>{" "}
                      <span className="font-bold">{scooter.specs.motor}</span>
                    </div>
                  )}
                  {scooter.specs.weight && (
                    <div>
                      <span className="text-slate-500">Weight:</span>{" "}
                      <span className="font-bold">{scooter.specs.weight}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Colors */}
            {scooter.colors && scooter.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-black mb-3">Available Colors:</h3>
                <div className="flex gap-3">
                  {scooter.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full border-2 ${
                        selectedColor === color
                          ? "border-indigo-600 ring-2 ring-indigo-200"
                          : "border-slate-300"
                      }`}
                      style={{ background: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              <span
                className={`px-4 py-2 rounded-full text-sm font-bold ${
                  scooter.inStock
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {scooter.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Book a Ride Button */}
            <Button
              onClick={handleBookRide}
              disabled={!scooter.inStock}
              className="w-full flex items-center justify-center gap-2 py-4 text-lg"
            >
              <Calendar size={20} />
              Book a Ride
            </Button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-black">Customer Reviews</h2>
            {isAuthenticated && (
              <button
                onClick={handleToggleReviewForm}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
              >
                {existingReview ? "Edit Your Review" : "Write a Review"}
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-slate-50 rounded-xl">
              <div className="mb-4">
                <label className="block font-bold mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star
                        size={24}
                        className={
                          star <= reviewForm.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block font-bold mb-2">Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                  rows="4"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
                >
                  {isEditing ? "Update Review" : "Submit Review"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewForm({ rating: 5, comment: "" });
                  }}
                  className="px-6 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="p-6 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="font-bold">{review.user?.name || "Anonymous"}</span>
                    {review.verifiedPurchase && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  {review.comment && (
                    <p className="text-slate-600">{review.comment}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">
              No reviews yet. Be the first to review this product!
            </p>
          )}
        </div>

        {/* Suggested Items */}
        {suggestedItems.length > 0 && (
          <div>
            <h2 className="text-3xl font-black mb-6">You May Also Like</h2>
            <div className="grid lg:grid-cols-4 gap-6">
              {suggestedItems.map((item) => (
                <Link
                  key={item._id}
                  to={`/scooter/${item._id}`}
                  className="p-4 rounded-xl border bg-white shadow hover:shadow-xl transition-all"
                >
                  {item.images && item.images.length > 0 && (
                    <img
                      src={`http://localhost:5000${item.images[0]}`}
                      alt={item.name}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h3 className="font-black mb-2">{item.name}</h3>
                  <p className="text-indigo-600 font-bold">${item.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && scooter && (
        <BookingModal
          scooter={scooter}
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          cartManager={cartManager}
          onSuccess={() => {
            // Keep open to show success message
          }}
        />
      )}
    </div>
  );
}
