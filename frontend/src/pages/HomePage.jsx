import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-10 text-center max-w-2xl">

        <h1 className="text-5xl font-bold text-blue-600 mb-6">
          📚 Book Recommendation System
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          Discover your next favorite book with personalized recommendations.
          Sign up or log in to explore our collection.
        </p>

        <div className="flex justify-center gap-6">
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Sign Up
          </Link>
        </div>

      </div>
    </div>
  );
}

export default HomePage;