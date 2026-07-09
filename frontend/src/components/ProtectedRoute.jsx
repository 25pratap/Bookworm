import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {
  const { token, loading } = useContext(AuthContext);

  // wait until auth is ready
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role) {
    const userRole = localStorage.getItem("role");

    if (userRole !== role) {
      return <Navigate to="/" replace />;
    }
  }


  return children;
}

export default ProtectedRoute;