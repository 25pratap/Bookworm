import { useEffect, useState } from "react";

function Analytics() {
  const [stats, setStats] = useState({
    books: 0,
    users: 0,
    reviews: 0,
  });

  useEffect(() => {
    fetch("http://localhost:8000/admin/stats", {
      headers: {
        Authorization:
          "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">
        Analytics Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-blue-500 text-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold">
            Total Books
          </h2>

          <p className="text-4xl mt-4">
            {stats.books}
          </p>
        </div>

        <div className="bg-green-500 text-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold">
            Total Users
          </h2>

          <p className="text-4xl mt-4">
            {stats.users}
          </p>
        </div>

        <div className="bg-yellow-500 text-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold">
            Total Reviews
          </h2>

          <p className="text-4xl mt-4">
            {stats.reviews}
          </p>
        </div>

      </div>
    </div>
  );
}

export default Analytics;