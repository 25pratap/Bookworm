function CheckoutPage() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>

      <p className="text-gray-600 mb-6">
        Checkout functionality is planned for a future version of the Bookworm
        system.
      </p>

      <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded">
        This module will allow users to review their cart before placing an
        order.
      </div>

      <button
        disabled
        className="mt-6 bg-gray-400 text-white px-6 py-2 rounded cursor-not-allowed"
      >
        Proceed to Payment (Coming Soon)
      </button>
    </div>
  );
}

export default CheckoutPage;