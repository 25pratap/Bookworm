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
  onAddToCart,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5">

      {/* COVER PLACEHOLDER (like your image) */}
      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
        {/* <span className="text-3xl text-gray-400 font-semibold">
          No Cover
        </span> */}
        <img src={noBook} alt="No Cover" className="w-64 h-64 object-cover" />
      </div>

      {/* TITLE */}
      <h2 className="text-xl font-bold">{title}</h2>

      {/* AUTHOR */}
      <p className="text-blue-600">{author}</p>

      {/* GENRE */}
      <p className="text-gray-600 mt-1">{genre}</p>

      {/* RATING + PRICE ROW */}
      <div className="flex justify-between items-center mt-3">
        <p className="text-yellow-500">
          ⭐ {rating ? rating : 0}
        </p>

        <p className="text-green-600 font-bold">
          Rs. {price}
        </p>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-2 mt-5">

        <Link
          to={`/books/${id}`}
          className="bg-green-600 text-white px-4 py-2 rounded flex-1 text-center"
        >
          View Details
        </Link>


        <button
            onClick={() => {
              toast.info("Adding to cart...");
              onAddToCart();
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded flex-1"
          >
            Add to Cart
          </button>

      </div>
    </div>
  );
}

export default BookCard;