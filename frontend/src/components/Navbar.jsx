import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-900 text-white">

    <Link to="/" className="text-xl font-bold text-yellow-400">
        📚 BookWorm
    </Link>

      <div className="flex gap-5 items-center">

        <Link to="/" className="hover:text-gray-300">
          Home
        </Link>

        {token && (
          <>
            <Link to="/books" className="hover:text-gray-300">
              Books
            </Link>

            <Link to="/admin" className="hover:text-gray-300">
              Admin
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;