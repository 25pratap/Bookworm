import { Link } from "react-router-dom";

function BookCard({ id, title, author }) {

  const handleRecommend = async () => {
    const response = await fetch(
      `http://127.0.0.1:8000/recommend/${encodeURIComponent(title)}`
    );

    const data = await response.json();

    alert(`Recommended Books:\n${data.recommendations.join("\n")}`);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) return;

    const response = await fetch(
      `http://127.0.0.1:8000/books/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    alert(data.message);

    // Reload the page to refresh the book list
    window.location.reload();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <h2 className="text-xl font-bold">{title}</h2>

      <p className="text-gray-500 mb-4">{author}</p>

      <div className="flex flex-wrap gap-3">

        <Link
          to={`/books/${id}`}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          View Details
        </Link>

        <button
          onClick={handleRecommend}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Recommend
        </button>

        <Link
          to={`/editbook/${id}`}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Edit
        </Link>

        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete
        </button>

      </div>
    </div>
  );
}

export default BookCard;