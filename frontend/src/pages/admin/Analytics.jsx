import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Analytics() {
  const [stats, setStats] = useState({
    books: 0,
    users: 0,
    reviews: 0,
    average_rating: 0,
    rating_distribution: {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
    },
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/admin/stats",
          {
            headers: {
              Authorization:
                "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.detail || "Failed to load analytics");
          return;
        }

        setStats(data);
      } catch (err) {
        console.error(err);
        toast.error("Server error while loading analytics");
      }
    };

    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Analytics Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Overview of your BookWorm system
          </p>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* BOOKS */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <p className="text-gray-500 font-medium">
              Total Books
            </p>

            <p className="text-4xl font-bold text-blue-600 mt-3">
              {stats.books}
            </p>
          </div>

          {/* USERS */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <p className="text-gray-500 font-medium">
              Total Users
            </p>

            <p className="text-4xl font-bold text-green-600 mt-3">
              {stats.users}
            </p>
          </div>

          {/* REVIEWS */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <p className="text-gray-500 font-medium">
              Total Reviews
            </p>

            <p className="text-4xl font-bold text-yellow-600 mt-3">
              {stats.reviews}
            </p>
          </div>

          {/* AVERAGE RATING */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <p className="text-gray-500 font-medium">
              Average Rating
            </p>

            <p className="text-4xl font-bold text-purple-600 mt-3">
              {stats.average_rating}
              <span className="text-2xl ml-1">⭐</span>
            </p>
          </div>

        </div>

        {/* RATING DISTRIBUTION */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Rating Distribution
          </h2>

          <div className="space-y-4">

            {[5, 4, 3, 2, 1].map((rating) => {
              const count =
                stats.rating_distribution?.[rating] || 0;

              const percentage =
                stats.reviews > 0
                  ? (count / stats.reviews) * 100
                  : 0;

              return (
                <div
                  key={rating}
                  className="flex items-center gap-4"
                >

                  {/* RATING */}
                  <div className="w-16 font-semibold text-gray-700">
                    {rating} ⭐
                  </div>

                  {/* BAR */}
                  <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">

                    <div
                      className="bg-yellow-400 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                  {/* COUNT */}
                  <div className="w-20 text-right text-gray-600">
                    {count} review{count !== 1 ? "s" : ""}
                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Analytics;