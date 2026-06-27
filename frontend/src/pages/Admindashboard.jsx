import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  // Role-based guard (token check is handled by ProtectedRoute)
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      alert("Access denied! Please login as Admin.");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">
          Admin Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">

        <Link
          to="/books"
          className="bg-blue-600 text-white rounded-xl p-8 shadow-lg hover:bg-blue-700 text-center"
        >
          <h2 className="text-2xl font-bold">📚 View Books</h2>
          <p className="mt-3">See all available books</p>
        </Link>

        <Link
          to="/addbook"
          className="bg-green-600 text-white rounded-xl p-8 shadow-lg hover:bg-green-700 text-center"
        >
          <h2 className="text-2xl font-bold">➕ Add Book</h2>
          <p className="mt-3">Add a new book</p>
        </Link>

        <Link
          to="/books"
          className="bg-yellow-500 text-white rounded-xl p-8 shadow-lg hover:bg-yellow-600 text-center"
        >
          <h2 className="text-2xl font-bold">✏️ Edit Book</h2>
          <p className="mt-3">Edit existing books</p>
        </Link>

        <Link
          to="/books"
          className="bg-red-600 text-white rounded-xl p-8 shadow-lg hover:bg-red-700 text-center"
        >
          <h2 className="text-2xl font-bold">🗑️ Delete Book</h2>
          <p className="mt-3">Delete books</p>
        </Link>

      </div>

    </div>
  );
}

export default AdminDashboard;