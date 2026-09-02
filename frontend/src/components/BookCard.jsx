import { Link } from "react-router-dom";
import noBook from "../assets/no-book.png";

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
          ? "bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden w-full h-[360px] flex flex-col border border-gray-100 hover:-translate-y-1 group"
          : "bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100 group"
      }
    >
      {/* COVER */}
      <Link
        to={`/books/${id}`}
        className={
          compact
            ? "w-full h-40 bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center shrink-0 p-2 overflow-hidden cursor-pointer"
            : "w-full h-52 bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-3 overflow-hidden cursor-pointer"
        }
      >
        <img
          src={cover || noBook}
          alt={title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = noBook;
          }}
          className={
            compact
              ? "h-36 w-auto object-contain rounded drop-shadow group-hover:scale-105 transition duration-300"
              : "h-44 w-auto object-contain rounded drop-shadow group-hover:scale-105 transition duration-300"
          }
        />
      </Link>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-1 min-h-0">
        {/* GENRE BADGE */}
        <div className="mb-1">
          <span className="inline-block px-2 py-0.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full border border-blue-100 truncate max-w-full">
            {genre || "General"}
          </span>
        </div>

        {/* TITLE */}
        <Link
          to={`/books/${id}`}
          className={
            compact
              ? "text-base font-bold text-gray-900 line-clamp-2 hover:text-blue-600 transition leading-snug cursor-pointer"
              : "text-lg font-bold text-gray-900 line-clamp-2 hover:text-blue-600 transition leading-snug cursor-pointer mt-0.5"
          }
        >
          {title}
        </Link>

        {/* AUTHOR */}
        <p className="text-xs text-gray-600 mt-1 truncate">
          by <span className="font-medium text-gray-800">{author}</span>
        </p>

        {/* RATING + PRICE */}
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <div className="flex text-amber-400 text-xs">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                  {star <= fullStars ? "★" : "☆"}
                </span>
              ))}
            </div>
            <span className="text-gray-500 text-xs ml-0.5 font-medium">
              {displayRating.toFixed(1)}
            </span>
          </div>

          <p className="text-emerald-600 font-bold text-sm">
            Rs. {price}
          </p>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-2 mt-3">
          <Link
            to={`/books/${id}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs text-center py-2 rounded-lg font-semibold transition"
          >
            Details
          </Link>

          {onAddToCart && (
            <button
              onClick={() => {
                onAddToCart();
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 rounded-lg font-semibold transition"
            >
              + Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookCard;