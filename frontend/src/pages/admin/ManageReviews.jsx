import { useEffect, useState } from "react";

function ManageReviews() {
  const [reviews, setReviews] = useState([]);

  const loadReviews = async () => {
    try {
      // Change this if your backend has another endpoint
      const res = await fetch("http://localhost:8000/reviews");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    await fetch(`http://localhost:8000/reviews/${id}`, {
      method: "DELETE",
    });

    loadReviews();
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Manage Reviews
      </h1>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Book ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Rating</th>
            <th className="border p-2">Comment</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {reviews.map((review) => (
            <tr key={review.id}>
              <td className="border p-2">{review.book_id}</td>
              <td className="border p-2">{review.name}</td>
              <td className="border p-2">{review.rating}</td>
              <td className="border p-2">{review.comment}</td>

              <td className="border p-2">
                <button
                  onClick={() => deleteReview(review.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageReviews;