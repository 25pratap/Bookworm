function DeliveryPage() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Delivery</h1>

      <p className="text-gray-600 mb-6">
        Delivery management will be implemented in a future version.
      </p>

      <div className="space-y-4">

        <input
          disabled
          type="text"
          placeholder="Delivery Address"
          className="w-full border p-3 rounded bg-gray-100"
        />

        <input
          disabled
          type="text"
          placeholder="Phone Number"
          className="w-full border p-3 rounded bg-gray-100"
        />

      </div>

      <button
        disabled
        className="mt-6 bg-gray-400 text-white px-6 py-2 rounded cursor-not-allowed"
      >
        Save Delivery Information
      </button>
    </div>
  );
}

export default DeliveryPage;