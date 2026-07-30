import { useEffect, useState } from "react";
import { useParams,useNavigate} from "react-router-dom";
import { toast } from "react-toastify";

function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
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
    fetch(`http://127.0.0.1:8000/books/${id}`)
      .then((response) => response.json())
      .then((data) => setBook(data))
      .catch((error) => console.error(error));

    loadReviews();
  }, [id]);

  const loadReviews = async () => {

    try {

      const response = await fetch(
        `http://127.0.0.1:8000/reviews/${id}`
      );


      const data = await response.json();
      console.log("DATA:", data);

      if (!response.ok) {
        toast.error("Failed to load reviews");
        return;
      }
      setReviews(data);
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

      const res = await fetch("http://127.0.0.1:8000/reviews", {
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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <div className="flex gap-8">

          {/* Book Cover */}
          
          <div>
            <img
              src={book.cover || "/noBook.png"}
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

            <button
              onClick={handleRecommendations}
              className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
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

          

  {/* Rating */}
  <label className="block font-semibold mb-2">
    Your Rating
  </label>

  <div className="flex gap-2 mb-5">

    {[1,2,3,4,5].map((star)=>(
      <button
        key={star}
        type="button"
        onClick={() => setRating(star)}
        className="text-3xl"
      >
        {star <= rating ? "⭐" : "☆"}
      </button>
    ))}

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