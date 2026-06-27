import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function BookDetailsPage() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  
  const averageRating =
  reviews.length > 0
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length
      ).toFixed(1)
    : "0.0";

  useEffect(() => {
    fetch(`http://localhost:8000/books/${id}`)
      .then((response) => response.json())
      .then((data) => setBook(data))
      .catch((error) => console.error(error));

    loadReviews();
  }, [id]);

  const loadReviews = () => {
    fetch(`http://localhost:8000/reviews/${id}`)
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error(error));
  };

  const handleSubmit = async () => {
    if (!name || !comment) {
      alert("Please fill all fields.");
      return;
    }

    const review = {
      book_id: Number(id),
      name,
      rating,
      comment,
    };

    await fetch("http://localhost:8000/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    });

    loadReviews();

    setName("");
    setRating(5);
    setComment("");
  };

  if (!book) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-2xl font-bold">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <div className="flex gap-8">

          {/* Book Cover */}
          <div>
            <img
              src={book.cover}
              alt="Book Cover"
              className="w-64 h-96 object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Book Details */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold">{book.title}</h1>

            <p className="text-xl text-gray-600 mt-3">
              <strong>Author:</strong> {book.author}
            </p>

            <p className="text-lg mt-2">
              <strong>Genre:</strong> {book.genre}
            </p>

            <div className="mt-4 flex items-center">
            <span className="text-yellow-500 text-2xl">
              {"⭐".repeat(Math.round(Number(averageRating)))}
            </span>

            <span className="text-black text-lg ml-2">
              {averageRating} / 5
            </span>
          </div>

            <h2 className="text-2xl font-semibold mt-8">
              Description
            </h2>

            <p className="text-gray-700 mt-2">
              {book.description}
            </p>

            <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
              Recommend Similar Books
            </button>
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
                  {"⭐".repeat(review.rating)} {review.name}
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

          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded p-3 w-full mb-4"
          />

          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border rounded p-3 w-full mb-4"
          >
            <option value="5">⭐⭐⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="3">⭐⭐⭐</option>
            <option value="2">⭐⭐</option>
            <option value="1">⭐</option>
          </select>

          <textarea
            rows="5"
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border rounded p-3 w-full"
          />

          <button
            onClick={handleSubmit}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            Submit Review
          </button>
        </div>

      </div>
    </div>
  );
}

export default BookDetailsPage;