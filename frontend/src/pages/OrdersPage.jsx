import { API_BASE_URL } from "../config/api";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import noBook from "../assets/no-book.png";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const navigate = useNavigate();
  const getOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/delivery`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setOrders(Array.isArray(data) ? data : []);
      } else {
        toast.error("Failed to load orders");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const cancelOrder = async (orderId) => {
  
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.detail || "Failed to cancel order");
        return;
      }

      toast.success("Order cancelled successfully");
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
      setShowCancelModal(false);
      setSelectedOrderId(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel order");
    }
  };
  const openCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true); };

  const closeCancelModal = () => { 
    setShowCancelModal(false); 
    setSelectedOrderId(null); };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              My Orders
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              View your order history and track active deliveries
            </p>
          </div>

          <Link
            to="/books"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow transition"
          >
            + Browse More Books
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-md p-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-16 text-center border border-gray-100">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-800">No Orders Placed Yet</h2>
            <p className="text-gray-500 mt-2">
              Browse our catalog, find books you like, and checkout in seconds.
            </p>
            <Link
              to="/books"
              className="inline-block mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Order ID #{order.id}
                    </span>
                    <h3 className="text-base font-bold text-gray-800 mt-0.5">
                      Recipient: {order.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      ● {order.status || "Pending"}
                    </span>
                    <span className="text-xs text-gray-500">
                      Payment: <strong className="text-gray-700">{order.payment_method || "Pending"}</strong>
                    </span>
                  </div>
                </div>

                {/* BOOK INFO */}
                <div className="py-4 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  <img
                    src={order.books?.cover || noBook}
                    alt={order.books?.title || "Book"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = noBook;
                    }}
                    className="w-16 h-24 object-contain rounded-lg bg-gray-50 border p-1 shrink-0"
                  />

                  <div className="flex-1">
                    {order.books?.genre && (
                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {order.books.genre}
                      </span>
                    )}

                    <h4 className="text-lg font-bold text-gray-900 mt-1">
                      {order.books?.title || `Book #${order.book_id}`}
                    </h4>

                    <p className="text-xs text-gray-600">
                      by {order.books?.author || "Author"}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-600">
                      <span>Quantity: <strong className="text-gray-800">{order.quantity}</strong></span>
                      {order.books?.price && (
                        <span>Unit Price: <strong className="text-gray-800">Rs. {order.books.price}</strong></span>
                      )}
                      {order.books?.price && (
                        <span>Total: <strong className="text-emerald-600 font-bold">Rs. {order.books.price * order.quantity}</strong></span>
                      )}
                    </div>
                  </div>

                  {/* ADDRESS */}
                  <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 border border-gray-100 max-w-xs">
                    <p className="font-semibold text-gray-800 mb-1">📍 Delivery Address</p>
                    <p>{order.address}</p>
                    <p>{order.city}, {order.state}</p>
                    <p className="text-gray-500 mt-1">Phone: {order.phone}</p>
                  </div>
                </div>

                {/* ACTIONS */}
                {order.status === "Pending" && (
                  <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                    <button
                      onClick={() => navigate("/payment")}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow transition"
                    >
                      Complete Payment
                    </button>
                    <button
                      onClick={() => openCancelModal(order.id)}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold transition"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {showCancelModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-2xl">
          ⚠️
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Cancel Order?
          </h2>
          <p className="text-sm text-gray-500">
            Order #{selectedOrderId}
          </p>
        </div>
      </div>

      <p className="text-gray-600 text-sm leading-6 mb-6">
        Are you sure you want to cancel this order? This action cannot be
        undone.
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            setShowCancelModal(false);
            setSelectedOrderId(null);
          }}
          className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-100 transition"
        >
          No, Keep Order
        </button>

        <button
          onClick={() => cancelOrder(selectedOrderId)}
          className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition"
        >
          Yes, Cancel Order
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default OrdersPage;