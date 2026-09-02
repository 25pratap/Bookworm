import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/reviews", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.detail || "Failed to load reviews");
        return;
      }
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const deleteReview = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this review?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8000/reviews/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.detail || "Failed to delete review");
        return;
      }

      toast.success("Review deleted successfully");
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };

  const filteredReviews = reviews.filter(
    (r) =>
      (r.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.comment || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.user_email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Link to="/admin/dashboard" className="hover:text-blue-600">← Admin Dashboard</Link>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Manage Reviews
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Total Reviews: {filteredReviews.length}
            </p>
          </div>

          <input
            type="text"
            placeholder="🔍 Search reviews or reviewer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-md p-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center text-gray-500">
            No reviews found matching your search.
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-800 text-white text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Book ID</th>
                    <th className="p-4">Reviewer</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4">Comment</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {filteredReviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-bold text-blue-600">
                        <Link to={`/books/${review.book_id}`} className="hover:underline">
                          #{review.book_id}
                        </Link>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-gray-900">{review.name || "User"}</p>
                        {review.user_email && (
                          <p className="text-xs text-gray-400">{review.user_email}</p>
                        )}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="text-amber-500 font-bold">
                          {"★".repeat(Math.round(Number(review.rating || 5)))}
                        </span>
                        <span className="text-gray-400 text-xs ml-1">
                          ({review.rating}/5)
                        </span>
                      </td>
                      <td className="p-4 max-w-md">
                        <p className="line-clamp-2 text-gray-700">{review.comment}</p>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => deleteReview(review.id)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold px-3 py-1.5 rounded-lg text-xs transition"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageReviews;