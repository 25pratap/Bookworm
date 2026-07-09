import { useState } from "react";

function BookQuantitySelector() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex items-center gap-3 mt-6">
      <button
        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
        className="bg-gray-300 px-3 py-1 rounded"
      >
        -
      </button>

      <span>{quantity}</span>

      <button
        onClick={() => setQuantity(quantity + 1)}
        className="bg-gray-300 px-3 py-1 rounded"
      >
        +
      </button>
    </div>
  );
}

export default BookQuantitySelector;
