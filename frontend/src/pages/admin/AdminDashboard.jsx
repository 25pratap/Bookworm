import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import DashboardCard from "../../components/DashboardCard";
import QuickActionButton from "../../components/QuickActionButton";
import StatsCard from "../../components/StatsCard";
import AdminFooter from "../../components/AdminFooter";
import { toast } from "react-toastify";
function AdminDashboard() {

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [stats, setStats] = useState({
    books: 0,
    users: 0,
    reviews: 0,
  });

  const loadStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to load dashboard statistics");
      }

      const data = await res.json();

      setStats(data);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard statistics");
    }
  };

  useEffect(() => {

    const role = localStorage.getItem("role");

    if (role !== "admin") {
      toast.error("Access denied!");
      navigate("/login");
      return;
    }

    loadStats();

  }, [navigate]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("name");

    toast.success("Logged out successfully");

    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      

    {/* Header */}
    <div className="flex flex-col md:flex-row justify-between items-center mb-10">

    <div>
        <h1 className="text-4xl font-bold text-gray-800">
        Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
        Manage books and users from one place.
        </p>
    </div>

    <div className="mt-6 md:mt-0 text-right">

        <h2 className="text-2xl font-semibold text-gray-800">
        Welcome, {localStorage.getItem("name") || "Admin"} 👋
        </h2>

        <p className="text-gray-500 mt-1">
            {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
            })}
            </p>

            <p className="text-gray-500 text-sm mt-1">
            Last Login: {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })}
            </p>

    </div>

    </div>

      {/* Statistics */}

      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <StatsCard
          title="Books"
          value={stats.books}
          icon="📚"
          color="bg-blue-600"
          lastUpdated={new Date().toLocaleString()}
        />

        <StatsCard
          title="Users"
          value={stats.users}
          icon="👥"
          color="bg-green-600"
          lastUpdated={new Date().toLocaleString()}
        />

        <StatsCard
          title="Reviews"
          value={stats.reviews}
          icon="⭐"
          color="bg-orange-500"
          lastUpdated={new Date().toLocaleString()}
        />

      </div>

      {/* Management */}

      <div className="grid md:grid-cols-3 gap-8 mb-10">

        <DashboardCard
          title="Manage Books"
          description="View, add, edit and delete books."
          icon="📚"
          color="bg-gradient-to-r from-blue-600 to cyan-500"
          to="/admin/managebooks"
        />

        <DashboardCard
          title="Manage Users"
          description="Search, edit and delete users."
          icon="👥"
          color="bg-gradient-to-r from-purple-600 to-pink-500"
          to="/admin/manageusers"
        />
        <DashboardCard
          title="Analytics"
          description="View ratings and system statistics."
          icon="📊"
          color="bg-gradient-to-r from-orange-500 to-red-500"
          to="/admin/analytics"
        />

      </div>

      {/* Quick Actions */}

      <h2 className="text-2xl font-bold mb-5">
        Quick Actions
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        <QuickActionButton
          title="Add Book"
          icon="➕"
          color="bg-green-600"
          to="/admin/addbook"
        />

        <QuickActionButton
          title="View Books"
          icon="📖"
          color="bg-blue-600"
          to="/books"
        />

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition px-6 py-4"
        >
          🚪 Logout
        </button>

      </div>
            <AdminFooter />
    </div>
  );
}

export default AdminDashboard;