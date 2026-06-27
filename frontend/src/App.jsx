import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import BooksPage from "./pages/BooksPage.jsx";
import BookDetailsPage from "./pages/BookDetailsPage.jsx";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar.jsx";
import AddBookPage from "./pages/AddBookPage.jsx";
import EditBookPage from "./pages/EditBookPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/books" element={
          <ProtectedRoute>
            <BooksPage />
          </ProtectedRoute>
        } />
        <Route path="/books/:id" element={
          <ProtectedRoute>
            <BookDetailsPage />
          </ProtectedRoute>
        } />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/addbook" element={
          <ProtectedRoute>
            <AddBookPage />
          </ProtectedRoute>
        } />

        <Route path="/edit-book/:id" element={
          <ProtectedRoute>
            <EditBookPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;