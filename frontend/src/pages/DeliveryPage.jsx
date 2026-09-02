import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import noBook from "../assets/no-book.png";

function DeliveryPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/delivery", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok && Array.isArray(data) && data.length > 0) {
          setOrder(data[0]); // latest order (since backend orders by id desc)
        }
      } catch (error) {
        console.error("Failed to load delivery details:", error);
      } finally {
        setLoading(false);
      }
    };

    getOrder();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading delivery details...</p>
        </div>
      </div>
    );
  }

  const steps = [
    { label: "Order Placed", key: "placed", done: true },
    {
      label: "Payment Confirmed",
      key: "confirmed",
      done: order?.status === "Confirmed" || order?.status === "Shipped" || order?.status === "Delivered",
    },
    {
      label: "Out for Delivery",
      key: "shipped",
      done: order?.status === "Shipped" || order?.status === "Delivered",
    },
    {
      label: "Delivered",
      key: "delivered",
      done: order?.status === "Delivered",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                Delivery Tracker
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Real-time tracking of your latest purchase
              </p>
            </div>

            {order && (
              <span className="px-4 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-full text-xs border border-blue-100">
                Status: {order.status || "Confirmed"}
              </span>
            )}
          </div>

          {order ? (
            <div className="mt-8 space-y-8">
              {/* DELIVERY TIMELINE */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-6">
                  Shipment Progress
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {steps.map((step, idx) => (
                    <div key={step.key} className="flex flex-col items-center text-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 shadow transition ${
                          step.done
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {step.done ? "✓" : idx + 1}
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          step.done ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* BOOK & ORDER DETAILS */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Book Card */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 flex gap-4 items-center">
                  <img
                    src={order.books?.cover || noBook}
                    alt={order.books?.title || "Book"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = noBook;
                    }}
                    className="w-20 h-28 object-contain rounded-lg bg-white border p-1 shadow-xs shrink-0"
                  />
                  <div>
                    <span className="px-2 py-0.5 text-xs font-semibold text-blue-700 bg-blue-100 rounded">
                      {order.books?.genre || "Book"}
                    </span>
                    <h4 className="font-bold text-gray-900 text-base mt-1 line-clamp-2">
                      {order.books?.title || `Book #${order.book_id}`}
                    </h4>
                    <p className="text-xs text-gray-600">by {order.books?.author || "Author"}</p>
                    <p className="text-emerald-600 font-bold text-sm mt-2">
                      Quantity: {order.quantity} • Rs. {(order.books?.price || 0) * order.quantity}
                    </p>
                  </div>
                </div>

                {/* Recipient & Payment Details */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-2 text-sm text-gray-700">
                  <h4 className="font-bold text-gray-900 mb-3 border-b pb-2">
                    Shipping Details
                  </h4>
                  <p><strong>Recipient:</strong> {order.name}</p>
                  <p><strong>Phone:</strong> {order.phone}</p>
                  <p><strong>Address:</strong> {order.address}, {order.city}, {order.state}</p>
                  <p><strong>Payment Method:</strong> {order.payment_method || "Cash on Delivery"}</p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                <Link
                  to="/orders"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-xl font-bold transition shadow"
                >
                  View All Orders
                </Link>
                <Link
                  to="/books"
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-center py-3 rounded-xl font-bold transition"
                >
                  Continue Browsing
                </Link>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="text-5xl mb-3">📦</div>
              <h3 className="text-xl font-bold text-gray-800">No active delivery found</h3>
              <p className="text-gray-500 mt-1">Place an order to start tracking shipments.</p>
              <Link
                to="/books"
                className="inline-block mt-4 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl"
              >
                Browse Store
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeliveryPage;