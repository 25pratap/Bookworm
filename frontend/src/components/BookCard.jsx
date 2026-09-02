import { Link } from "react-router-dom";
import noBook from "../assets/no-book.png";
import { toast } from "react-toastify";

function BookCard({
  id,
  title,
  author,
  price,
  rating,
  genre,
  cover,
  onAddToCart,
  compact = false,
}) {
  const displayRating = Number(rating) || 0;
  const fullStars = Math.round(displayRating);
  return (
    <div
      className={
        compact
          ? "bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden w-full h-85 flex flex-col border border-gray-100"
          : "bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100"
      }
    >

      {/* COVER */}
      <div
        className={
          compact
            ? "w-full h-36 bg-gray-100 flex items-center justify-center shrink-0"
            : "w-full h-48 bg-gray-100 flex items-center justify-center"
        }
      >
        <img
          src={cover || noBook}
          alt={title}
          className={
            compact
              ? "h-28 w-auto object-contain"
              : "h-36 object-contain"
          }
        />
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-1 min-h-0">

        {/* TITLE */}
        <h2
          className={
            compact
              ? "text-lg font-bold h-12 leading-6 line-clamp-2 overflow-hidden"
              : "text-xl font-bold h-14 leading-7 line-clamp-2 overflow-hidden"
          }
        >
          {title}
        </h2>

        {/* AUTHOR */}
        <p
          className={
            compact
              ? "text-sm text-blue-600 mt-1 h-5 truncate"
              : "text-sm text-blue-600 mt-1"
          }
        >
          {author}
        </p>

        {/* GENRE */}
        <p
          className={
            compact
              ? "text-sm text-gray-500 h-5 truncate"
              : "text-sm text-gray-500"
          }
        >
          {genre}
        </p>

        {/* RATING + PRICE */}
        {!compact && (
          <div className="flex justify-between items-center mt-5 mb-1">

          <div className="flex items-center gap-1">
            <div className="flex text-yellow-400 text-sm">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                  {star <= fullStars ? "★" : "☆"}
                </span>
              ))}
            </div>

  <span className="text-gray-600 text-sm ml-1">
    {displayRating.toFixed(1)} / 5
  </span>
</div>

            <p className="text-green-600 font-bold">
              Rs. {price}
            </p>

          </div>
        )}

        {/* BUTTONS — ONLY BOOK COLLECTION */}
        {!compact && (
          <div className="flex gap-2 mt-auto pt-5">

            {/* VIEW DETAILS */}
            <Link
              to={`/books/${id}`}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-2.5 rounded-lg font-medium transition"
            >
              View Details
            </Link>

            {/* ADD TO CART */}
            <button
              onClick={() => {
                toast.info("Adding to cart...");
                onAddToCart();
              }}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition"
            >
              Add to Cart
            </button>

          </div>
        )}

      </div>
    </div>
  );
}

export default BookCard;