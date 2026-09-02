import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import noBook from "../assets/no-book.png";

function RecommendationsPage() {
  const { title } = useParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRecommendations = async () => {
      setLoading(true);
      try {
        const email = localStorage.getItem("email");

        const response = await fetch(
          `http://localhost:8000/recommend/${encodeURIComponent(
            email
          )}/${encodeURIComponent(title)}`
        );

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.detail || "Failed to load recommendations");
          return;
        }

        setBooks(data.recommendations || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch recommendations.");
      } finally {
        setLoading(false);
      }
    };

    getRecommendations();
  }, [title]);

  const handleAddToCart = async (bookId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to add items to cart.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/cart", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          book_id: bookId,
          quantity: 1,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.detail || "Failed to add to cart");
        return;
      }

      toast.success("Added to cart!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link to="/books" className="hover:text-blue-600">← Back to Books Catalog</Link>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Smart Recommendations
          </h1>
          <p className="text-gray-600 mt-1">
            Personalized AI recommendations based on your selection: <span className="font-semibold text-blue-600">"{title}"</span>
          </p>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Analyzing plots, genres, and reader preferences...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <div className="text-5xl mb-3">📚</div>
            <h3 className="text-xl font-bold text-gray-800">No Similar Recommendations Found</h3>
            <p className="text-gray-500 mt-2">Try browsing other categories or selecting a different book.</p>
            <Link to="/books" className="inline-block mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
              Explore All Books
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col sm:flex-row gap-5 items-center justify-between"
              >
                {/* LEFT: COVER + DETAILS */}
                <div className="flex gap-4 items-center w-full sm:w-auto">
                  <Link to={`/books/${book.id}`} className="shrink-0">
                    <img
                      src={book.cover || noBook}
                      alt={book.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = noBook;
                      }}
                      className="w-20 h-28 object-contain rounded-lg bg-gray-50 border p-1 shadow-sm hover:scale-105 transition"
                    />
                  </Link>

                  <div>
                    {/* BADGES */}
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full border border-blue-100">
                        {book.genre}
                      </span>
                      {book.match_percentage && (
                        <span className="px-2.5 py-0.5 text-xs font-bold text-purple-700 bg-purple-50 rounded-full border border-purple-100">
                          🎯 {book.match_percentage}% Match
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/books/${book.id}`}
                      className="text-lg font-bold text-gray-900 hover:text-blue-600 transition line-clamp-1"
                    >
                      {book.title}
                    </Link>

                    <p className="text-sm text-gray-600 mt-0.5">
                      by <span className="font-medium text-gray-800">{book.author}</span>
                    </p>

                    {book.reason && (
                      <p className="text-xs text-indigo-600 mt-1.5 flex items-center gap-1 font-medium bg-indigo-50 px-2 py-0.5 rounded w-fit">
                        💡 {book.reason}
                      </p>
                    )}
                  </div>
                </div>

                {/* RIGHT: RATING, PRICE & ACTIONS */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center text-amber-500 font-bold text-sm">
                      ★ {book.avg_rating?.toFixed(1) ?? "0.0"} / 5
                    </div>
                    {book.price > 0 && (
                      <span className="text-emerald-600 font-bold text-base">
                        Rs. {book.price}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/books/${book.id}`}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(book.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                    >
                      + Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecommendationsPage;