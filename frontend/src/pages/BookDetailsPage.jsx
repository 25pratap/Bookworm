import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Rating from "@mui/material/Rating";
import noBook from "../assets/no-book.png";

function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  
  const averageRating =
  reviews.length > 0
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length
      ).toFixed(1)
    : (book?.rating ? Number(book.rating).toFixed(1) : "0.0");

  useEffect(() => {
    fetch(`http://localhost:8000/books/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load book");
        return response.json();
      })
      .then((data) => setBook(data))
      .catch((error) => {
        console.error(error);
        toast.error("Failed to load book details");
      });

    loadReviews();
  }, [id]);

  const loadReviews = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/reviews/${id}`
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error("Failed to load reviews");
        return;
      }
      setReviews(data || []);
    } catch (error) {
      console.error("LOAD REVIEWS ERROR:", error);
    }
  };

  const handleAddToCart = async (goToCheckout = false) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to add items to cart.");
      navigate("/login");
      return;
    }

    setAddingToCart(true);
    try {
      const response = await fetch("http://localhost:8000/cart", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          book_id: Number(id),
          quantity: quantity,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.detail || "Failed to add to cart");
        return;
      }

      toast.success(`Added ${quantity} ${quantity > 1 ? "copies" : "copy"} to cart!`);
      if (goToCheckout) {
        navigate("/checkout");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding book to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleRecommendations = () => {
    navigate(`/recommendations/${encodeURIComponent(book.title)}`);
  };
    
  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.error("Please write your review.");
      return;
    }

    try {
      const review = {
        book_id: Number(id),
        rating: Number(rating),
        comment: comment.trim()
      };

      const res = await fetch("http://localhost:8000/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(review),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.detail || "Failed to submit review");
        return;
      }

      toast.success("Review submitted successfully!"); 
      setRating(5);
      setComment("");
      await loadReviews();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit review");
    }
  };

  if (!book) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-700">Loading Book Details...</h2>
        </div>
      </div>
    );
  }

  const inStock = (book.stock ?? 10) > 0;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8">

        {/* BREADCRUMB */}
        <div className="mb-6 flex items-center text-sm text-gray-500 gap-2">
          <Link to="/books" className="hover:text-blue-600">← Back to Books</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium truncate">{book.title}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

          {/* Book Cover */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-sm rounded-xl overflow-hidden shadow-lg bg-gray-50 border p-4 flex items-center justify-center">
              <img
                src={book.cover || noBook}
                alt={book.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = noBook;
                }}
                className="w-full h-96 object-contain rounded drop-shadow-md"
              />
            </div>

            {/* Quick Meta Info */}
            <div className="w-full max-w-sm mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs uppercase font-semibold">Published</p>
                <p className="font-bold text-gray-800">{book.publication_date || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase font-semibold">Pages</p>
                <p className="font-bold text-gray-800">{book.pages ? `${book.pages} pages` : "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Book Details & Actions */}
          <div className="md:col-span-7 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                {book.genre}
              </span>
              {inStock ? (
                <span className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full">
                  ✓ In Stock ({book.stock ?? 10} available)
                </span>
              ) : (
                <span className="px-3 py-1 text-xs font-semibold text-rose-700 bg-rose-100 rounded-full">
                  ✕ Out of Stock
                </span>
              )}
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">{book.title}</h1>

            <p className="text-lg text-gray-600 mt-2">
              by <span className="font-semibold text-blue-600">{book.author}</span>
            </p>

            {/* Rating Stars */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex text-amber-400 text-lg">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>
                    {star <= Math.round(Number(averageRating)) ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <span className="text-gray-800 font-bold text-base">{averageRating} / 5</span>
              <span className="text-gray-400 text-sm">({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</span>
            </div>

            {/* Price Tag */}
            <div className="mt-5 p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-emerald-600">Rs. {book.price}</span>
              <span className="text-xs text-gray-500">Includes all applicable taxes</span>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center">
              {/* Quantity */}
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition"
                >
                  -
                </button>
                <span className="px-6 py-3 font-bold text-gray-800 text-center min-w-[3rem]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={() => handleAddToCart(false)}
                disabled={addingToCart}
                className="flex-1 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                🛒 Add to Cart
              </button>

              {/* Buy Now */}
              <button
                onClick={() => handleAddToCart(true)}
                disabled={addingToCart}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition duration-200 cursor-pointer disabled:opacity-50"
              >
                ⚡ Buy Now
              </button>
            </div>

            {/* Smart Recommendation Button */}
            <div className="mt-5">
              <button
                onClick={handleRecommendations}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-5 rounded-xl font-semibold shadow flex items-center justify-center gap-2 transition"
              >
                ✨ Recommend Similar Books
              </button>
            </div>

            {/* Description */}
            <div className="mt-6 border-t pt-5">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700 leading-relaxed text-sm">{book.description}</p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-4">
            Reviews
          </h2>

          {reviews.length === 0 ? (
            <p className="text-gray-500">
              No reviews yet.
            </p>
          ) : (
            reviews.map((review, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 mb-4"
              >
                <h3 className="font-semibold">
                  ⭐ {review.rating}/5 &nbsp; {review.name}
                </h3>

                <p>{review.comment}</p>
              </div>
            ))
          )}
        </div>

        {/* Add Review */}
        <div className="mt-12">

          <h2 className="text-3xl font-bold mb-4">
            Add Review
          </h2>

          

  {/* Rating */}
  <label className="block font-semibold mb-2">
    Your Rating
  </label>

  <div className="mb-5">
      <Rating
        name="book-rating"
        value={rating}
        precision={0.5}
        onChange={(event, newValue) => {
          setRating(newValue);
        }}
        size="large"
      />

      <p className="mt-2">
        Rating: {rating}
        </p>
  </div>


  {/* Comment */}
  <label className="block font-semibold mb-2">
    Your Review
  </label>

  <textarea
    rows="5"
    placeholder="Write your review..."
    value={comment}
    onChange={(e)=>setComment(e.target.value)}
    className="
      w-full
      border
      rounded-lg
      p-3
      mb-5
      focus:outline-none
      focus:ring-2
      focus:ring-blue-400
    "
  />


  {/* Submit */}
  <button
    onClick={handleSubmit}
    className="
      bg-green-600
      hover:bg-green-700
      text-white
      px-8
      py-3
      rounded-lg
      font-semibold
    "
  >
    Submit Review
  </button>

</div>

      </div>
    </div>
  );
}

export default BookDetailsPage;