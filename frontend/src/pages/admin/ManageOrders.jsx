import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import noBook from "../../assets/no-book.png";

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/admin/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.detail || "Failed to load orders");
        return;
      }
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load customer orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.detail || "Failed to update order status");
        return;
      }

      toast.success(`Order #${orderId} marked as ${newStatus}`);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (order.user_email || "").toLowerCase().includes(search.toLowerCase()) ||
      (order.books?.title || "").toLowerCase().includes(search.toLowerCase()) ||
      String(order.id).includes(search);

    const matchesStatus =
      statusFilter === "All" ||
      (order.status || "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Link to="/admin/dashboard" className="hover:text-blue-600">← Admin Dashboard</Link>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Manage Orders
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Total Customer Orders: {filteredOrders.length}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="🔍 Search order ID, name, email, book..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-md p-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading customer orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center text-gray-500">
            No orders found matching the filter.
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-800 text-white text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Book</th>
                    <th className="p-4">Quantity & Total</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Update Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-bold text-gray-900">
                        #{order.id}
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-gray-900">{order.name}</p>
                        <p className="text-xs text-gray-400">{order.user_email}</p>
                        <p className="text-xs text-gray-500 mt-0.5">📞 {order.phone}</p>
                        <p className="text-xs text-gray-500">📍 {order.city}, {order.state}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={order.books?.cover || noBook}
                            alt="Cover"
                            className="w-10 h-14 object-contain rounded bg-gray-50 border p-0.5 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-gray-900 line-clamp-1">
                              {order.books?.title || `Book #${order.book_id}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.books?.author || "Author"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <p className="font-semibold">{order.quantity} units</p>
                        <p className="text-emerald-600 font-bold">
                          Rs. {((order.books?.price || 0) * order.quantity).toFixed(2)}
                        </p>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="text-xs font-semibold bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
                          {order.payment_method || "Pending"}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          ● {order.status || "Pending"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <select
                          value={order.status || "Pending"}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageOrders;
