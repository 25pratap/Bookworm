import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import noBook from "../assets/no-book.png";

function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Cart error:", data);
        setCart([]);
        return;
      }
      setCart(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadCart();
  }, [token]);

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(cartId);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/cart/${cartId}?quantity=${newQuantity}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setCart((prev) =>
          prev.map((item) =>
            item.id === cartId ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        toast.error("Failed to update quantity");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  const removeItem = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/cart/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        toast.success("Item removed from cart");
        setCart((prev) => prev.filter((item) => item.id !== id));
      } else {
        toast.error("Failed to remove item");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + (item.books?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          Shopping Cart
        </h1>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-md p-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading your shopping cart...</p>
          </div>
        ) : cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-16 text-center border border-gray-100">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mt-2">
              Looks like you haven't added any books yet.
            </p>
            <Link
              to="/books"
              className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow transition"
            >
              Explore Books
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5"
                >
                  <div className="flex gap-5 items-center">
                    {/* Cover Thumbnail */}
                    <Link to={`/books/${item.book_id}`} className="shrink-0">
                      <img
                        src={item.books?.cover || noBook}
                        alt={item.books?.title || "Book"}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = noBook;
                        }}
                        className="w-20 h-28 object-contain rounded-lg bg-gray-50 border p-1 shadow-xs"
                      />
                    </Link>

                    {/* Details */}
                    <div>
                      <span className="px-2 py-0.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full border border-blue-100">
                        {item.books?.genre || "Book"}
                      </span>

                      <Link
                        to={`/books/${item.book_id}`}
                        className="text-lg font-bold text-gray-900 hover:text-blue-600 transition block mt-1 line-clamp-1"
                      >
                        {item.books?.title}
                      </Link>

                      <p className="text-xs text-gray-600 mt-0.5">
                        by <span className="font-medium text-gray-800">{item.books?.author}</span>
                      </p>

                      <p className="text-emerald-600 font-bold text-base mt-2">
                        Rs. {item.books?.price}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs text-gray-500 font-medium">Quantity:</span>
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 font-bold transition text-xs"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 font-bold text-gray-800 text-xs">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 font-bold transition text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <p className="text-lg font-extrabold text-gray-900">
                      Rs. {((item.books?.price || 0) * item.quantity).toFixed(2)}
                    </p>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg font-semibold transition"
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-5 border-b pb-3">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Total Items ({cart.reduce((s, i) => s + i.quantity, 0)} units)</span>
                    <span className="font-semibold text-gray-800">{cart.length} books</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span className="font-semibold text-emerald-600">FREE</span>
                  </div>

                  <div className="border-t pt-3 flex justify-between items-baseline">
                    <span className="font-bold text-gray-900 text-base">Grand Total</span>
                    <span className="font-extrabold text-2xl text-emerald-600">
                      Rs. {total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3.5 rounded-xl font-bold mt-6 shadow-md transition"
                >
                  Proceed to Checkout →
                </Link>

                <Link
                  to="/books"
                  className="block mt-3 text-center text-xs text-gray-600 hover:text-blue-600 py-2"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;