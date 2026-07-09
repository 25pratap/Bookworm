import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function RecommendationsPage() {
  const { title } = useParams();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const getRecommendations = async () => {
      try {
        const email = localStorage.getItem("email");

        const response = await fetch(
          `http://localhost:8000/recommend/${encodeURIComponent(
            email
          )}/${encodeURIComponent(title)}`
        );

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.detail);
          return;
        }

        setBooks(data.recommendations || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch recommendations.");
      }
    };

    getRecommendations();
  }, [title]);
return (
  <div className="max-w-5xl mx-auto p-8">

    <h1 className="text-3xl font-bold mb-2">
      Recommended Books
    </h1>

    <p className="text-gray-600 mb-6">
      Based on: <strong>{title}</strong>
    </p>

    {books.length === 0 ? (
      <p className="text-gray-500">No recommendations found.</p>
    ) : (
      <div className="space-y-5">

        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >

            {/* TOP SECTION */}
            <div className="flex justify-between items-start gap-4">

              {/* LEFT CONTENT */}
              <div className="flex-1">

                <h2 className="text-xl font-bold text-gray-800">
                  {book.title}
                </h2>

                <p className="text-gray-600 mt-1">
                  <span className="font-semibold">Author:</span> {book.author}
                </p>

                <p className="text-gray-600">
                  <span className="font-semibold">Genre:</span> {book.genre}
                </p>

               

              </div>

              {/* SCORE BADGE */}
              <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                {book.similarity?.toFixed(2) ?? "0.00"}
              </div>

            </div>

          </div>
        ))}

      </div>
    )}
  </div>
);
}

export default RecommendationsPage;