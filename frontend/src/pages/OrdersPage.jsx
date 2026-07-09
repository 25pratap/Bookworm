function OrdersPage() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">My Orders</h1>

        <p className="text-gray-600 mb-6">
          Order placement and tracking are planned for a future version of the
          Bookworm system.
        </p>

        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg p-5">
          <h2 className="text-xl font-semibold mb-2">
            🚧 Feature Coming Soon
          </h2>

          <p>
            In the next version, users will be able to:
          </p>

          <ul className="list-disc list-inside mt-3 text-left inline-block">
            <li>Place orders from the shopping cart</li>
            <li>View order history</li>
            <li>Track order status</li>
            <li>Cancel pending orders</li>
            <li>Download order receipts</li>
          </ul>
        </div>

        <button
          disabled
          className="mt-8 bg-gray-400 text-white px-6 py-3 rounded cursor-not-allowed"
        >
          Order Module (Coming Soon)
        </button>
      </div>
    </div>
  );
}

export default OrdersPage;