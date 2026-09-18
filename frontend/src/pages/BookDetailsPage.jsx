import { API_BASE_URL } from "../config/api";
import { useEffect, useState } from "react";
import { useParams,useNavigate,Link} from "react-router-dom";
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
  
  const averageRating =
  reviews.length > 0
    ? (
        reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
        reviews.length
      ).toFixed(1)
    : (book?.rating ? Number(book.rating).toFixed(1) : "0.0");

  const inStock = Number(book?.stock ?? 0) > 0;

  useEffect(() => {
    fetch(`${API_BASE_URL}/books/${id}`)
      .then((response) =>{
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
        `${API_BASE_URL}/reviews/${id}`
      );


      const data = await response.json();
      if (!response.ok) {
        toast.error("Failed to load reviews");
        return;
      }
      setReviews(data || []);
    } catch (error) {
      console.error("LOAD REVIEWS ERROR:",error);
      toast.error("Unable to load reviews");

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
            rating:Number(rating),
            comment:comment.trim()
          };

      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(review),
      });

      const data =await res.json();
      console.log("Review response:",data);

      if (!res.ok) {
        toast.error(data.detail || "Failed to submit review");
        return;
      }

      toast.success("Review submitted successfully"); 


      setRating(5);
      setComment("");

      await loadReviews();

    } catch (error) {
      console.error(error)
      toast.error("Failed to submit review");
    }
  };

    if (!book) {
      return (
        <div className="flex justify-center items-center h-screen">
          <h2 className="text-2xl font-bold">Loading...</h2>
        </div>
      );
    }

  return (
  <div className="min-h-screen bg-gray-100 px-4 py-4">
    <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8">

      {/* BREADCRUMB */}
      <div className="mb-5 flex items-center text-sm text-gray-500 gap-2">
        <Link
          to="/books"
          className="hover:text-blue-600"
        >
          ← Back to Books
        </Link>

        <span>/</span>

        <span className="text-gray-800 font-medium truncate">
          {book.title}
        </span>
      </div>

      {/* BOOK INFORMATION */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

        {/* BOOK COVER */}
        <div className="md:col-span-4 flex justify-center">

          <div className="w-full max-w-sm rounded-xl overflow-hidden shadow-lg bg-gray-50 border p-4 flex items-center justify-center">
            <img
              src={book.cover || noBook}
              alt={book.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = noBook;
              }}
              className="w-full h-120 object-contain rounded drop-shadow-md"
            />
          </div>

        </div>

        {/* BOOK DETAILS */}
        <div className="md:col-span-8 flex flex-col">

          {/* TITLE */}
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
            {book.title}
          </h1>

          {/* BOOK INFORMATION */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-4">

            {/* AUTHOR */}
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">
                Author
              </p>

              <p className="font-medium text-gray-800">
                {book.author || "N/A"}
              </p>
            </div>

            {/* GENRE */}
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">
                Genre
              </p>

              <p className="font-medium text-gray-800">
                {book.genre || "N/A"}
              </p>
            </div>

            {/* PUBLISHED */}
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">
                Published
              </p>

              <p className="font-medium text-gray-800">
                {book.publication_date || "N/A"}
              </p>
            </div>

            {/* PAGES */}
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">
                Pages
              </p>

              <p className="font-medium text-gray-800">
                {book.pages
                  ? `${book.pages} pages`
                  : "N/A"}
              </p>
            </div>

            {/* STOCK */}
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">
                Stock
              </p>

              <p
                className={
                  inStock
                    ? "font-medium text-emerald-600"
                    : "font-medium text-rose-600"
                }
              >
                {inStock
                  ? `${book.stock ?? 0} available`
                  : "Out of Stock"}
              </p>
            </div>

          </div>

          {/* RATING */}
          <div className="mt-4 flex items-center gap-3">

            <div className="flex text-amber-400 text-lg">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                  {star <= Math.round(Number(averageRating))
                    ? "★"
                    : "☆"}
                </span>
              ))}
            </div>

            <span className="text-gray-800 font-bold">
              {averageRating} / 5
            </span>

            <span className="text-gray-400 text-sm">
              ({reviews.length}{" "}
              {reviews.length === 1
                ? "review"
                : "reviews"})
            </span>

          </div>

          {/* PRICE */}
          <div className="mt-4 w-fit">

            <span className="text-3xl font-extrabold text-emerald-600">
              Rs. {book.price}
            </span>

          </div>

          {/* QUANTITY */}
          <div className="mt-4">

            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white w-fit">

              <button
                onClick={() =>
                  setQuantity((q) => Math.max(1, q - 1))
                }
                disabled={!inStock}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition disabled:opacity-50"
              >
                -
              </button>

              <span className="px-6 py-2 font-bold text-gray-800 text-center">
                {quantity}
              </span>

              <button
                onClick={() =>
                  setQuantity((q) =>
                    Math.min(
                      q + 1,
                      Number(book.stock ?? 0)
                    )
                  )
                }
                disabled={
                  !inStock ||
                  quantity >= Number(book.stock ?? 0)
                }
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition disabled:opacity-50"
              >
                +
              </button>

            </div>

          </div>

          {/* RECOMMENDATION BUTTON */}
          <div className="mt-5">

            <button
              onClick={handleRecommendations}
              className="bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md flex items-center justify-center gap-2 transition"
            >
              Recommend Similar Books
            </button>

          </div>

          {/* DESCRIPTION */}
          <div className="mt-5 border-t pt-4">

            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Description
            </h2>

            <p className="text-gray-700">
              {book.description || "No description available."}
            </p>

          </div>

        </div>
      </div>

      {/* REVIEWS */}
      <div className="mt-10">

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
              key={review.id || index}
              className="border rounded-lg p-4 mb-4"
            >

              <h3 className="font-semibold">
                ⭐ {review.rating}/5{" "}
                {review.name && `• ${review.name}`}
              </h3>

              <p className="mt-2 text-gray-700">
                {review.comment}
              </p>

            </div>

          ))
        )}

      </div>

      {/* ADD REVIEW */}
      <div className="mt-10">

        <h2 className="text-3xl font-bold mb-4">
          Add Review
        </h2>

        {/* RATING */}
        <label className="block font-semibold mb-2">
          Your Rating
        </label>

        <div className="mb-5">

          <Rating
            name="book-rating"
            value={rating}
            precision={0.5}
            onChange={(event, newValue) => {
              setRating(newValue ?? 5);
            }}
            size="large"
          />

          <p className="mt-2">
            Rating: {rating}
          </p>

        </div>

        {/* COMMENT */}
        <label className="block font-semibold mb-2">
          Your Review
        </label>

        <textarea
          rows="5"
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded-lg p-3 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold"
        >
          Submit Review
        </button>

      </div>

    </div>
  </div>
  );
}
export default BookDetailsPage;