import { useEffect, useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { getReviews } from "../services/reviewService";
import Reveal from "./Reveal";

export default function ReviewService() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getReviews();
        setReviews(data);
      } catch (err) {
        setError("Failed to load reviews");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const avg =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : "5.0";

  return (
    <section className="min-h-screen bg-slate-50 py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black mb-3">Customer Reviews</h1>
            <p className="text-slate-600">
              Hear what riders say about their MetroVolt experience.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-indigo-600 font-black">
              <Star className="fill-yellow-400 text-yellow-400" /> {avg} / 5 • {reviews.length} reviews
            </div>
          </div>
        </Reveal>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading reviews...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-rose-600 font-bold">{error}</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 text-slate-600">
            No reviews yet. Book a test ride and be the first to review!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <Reveal key={review._id}>
                <div className="bg-white p-6 rounded-2xl shadow border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={18}
                        className={
                          s <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-300"
                        }
                      />
                    ))}
                    <span className="text-sm text-slate-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-black mb-1">{review.user?.name || "Anonymous"}</p>
                  {review.comment && (
                    <p className="text-slate-600 mb-3">{review.comment}</p>
                  )}
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <MessageSquare size={14} />
                    {review.scooter?.name || "MetroVolt"}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}