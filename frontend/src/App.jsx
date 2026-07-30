import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import BooksPage from "./pages/BooksPage.jsx";
import BookDetailsPage from "./pages/BookDetailsPage.jsx";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/admin/AdminLoginPages.jsx";
import Navbar from "./components/Navbar.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageBooks from "./pages/admin/ManageBooks";
import ManageUsers from "./pages/admin/ManageUsers";
import AddBookPage from "./pages/admin/AddBookPage.jsx";
import EditBookPage from "./pages/admin/EditBookPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import GenrePreferencePage from "./pages/GenrePreferencePage.jsx";
import ChangePasswordPage from "./pages/ChangePasswordPage.jsx";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import ManageReviews from "./pages/admin/ManageReviews";
import Analytics from "./pages/admin/Analytics";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import DeliveryPage from "./pages/DeliveryPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

function App() {
  return(
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/preferences" element={<GenrePreferencePage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
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
          path="/recommendations/:title"
          element={
          <ProtectedRoute>
            <RecommendationsPage />
          </ProtectedRoute>
        }/>
              

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />

      <Route path="/admin/managebooks" element={<ProtectedRoute role="admin"><ManageBooks /></ProtectedRoute>} />

      <Route path="/admin/manageusers" element={<ProtectedRoute role="admin"><ManageUsers /></ProtectedRoute>} />

      <Route path="/admin/addbook" element={<ProtectedRoute role="admin"><AddBookPage /></ProtectedRoute>} />

      <Route path="/admin/editbook/:id" element={<ProtectedRoute role="admin"><EditBookPage /></ProtectedRoute>} />
      <Route path="/admin/reviews" element={<ManageReviews />} />

      <Route path="/admin/analytics" element={<Analytics />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/delivery" element={<DeliveryPage />} />

      </Routes>
      <ToastContainer position="top-right"autoClose={3000}/>
        </BrowserRouter>
  );
      <Route 
      path="/orders" 
      element={<OrdersPage />} 
    />
}

export default App;