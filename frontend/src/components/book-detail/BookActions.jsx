function BookActions({ onAddToCart, onBorrow }) {
  return (
    <div className="flex gap-4 mt-6">
      <button
        onClick={onAddToCart}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
      >
        Add to Cart
      </button>

      <button
        onClick={onBorrow}
        className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
      >
        Borrow
      </button>
    </div>
  );
}

export default BookActions;