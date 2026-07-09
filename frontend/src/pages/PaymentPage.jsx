function PaymentPage() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Payment</h1>

      <p className="text-gray-600 mb-6">
        Payment integration will be added in a future version.
      </p>

      <div className="space-y-3">
        <button
          disabled
          className="w-full bg-gray-400 text-white py-2 rounded cursor-not-allowed"
        >
          Cash on Delivery
        </button>

        <button
          disabled
          className="w-full bg-gray-400 text-white py-2 rounded cursor-not-allowed"
        >
          eSewa
        </button>

        <button
          disabled
          className="w-full bg-gray-400 text-white py-2 rounded cursor-not-allowed"
        >
          Khalti
        </button>
      </div>

      <p className="text-sm text-gray-500 mt-5">
        Payment processing is not available in this version.
      </p>
    </div>
  );
}

export default PaymentPage;