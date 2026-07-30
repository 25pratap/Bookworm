import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CartPage() {
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("token");

  const loadCart = async () => {
    const res = await fetch("http://localhost:8000/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    console.log("CART RESPONSE:",data);
    if(!res.ok){
      Console.error(data);
      setCart([])
      return;
    }
    setCart(Array.isArray(data) ? data  : []);
  };

  useEffect(() => {
    if (token) loadCart();
  }, [token]);

  const removeItem = async (id) => {
    await fetch(`http://localhost:8000/cart/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    loadCart();
  };

  const total = cart.reduce(
    (sum, item) => sum + (item.books?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-16 text-center">
            <div className="text-6xl mb-4">🛒</div>

            <h2 className="text-2xl font-semibold">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mt-2">
              Looks like you haven't added any books yet.
            </p>

            <Link
              to="/books"
              className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-5">

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow p-5 flex justify-between items-center"
                >
                  <div className="flex gap-5">

                    {/* Cover Placeholder */}
                    <div className="w-28 h-36 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                      No Cover
                    </div>

                    {/* Details */}
                    <div>
                      <h2 className="text-2xl font-bold">
                        {item.books?.title}
                      </h2>

                      <p className="text-gray-600 mt-1">
                        {item.books?.author}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {item.books?.genre}
                      </p>

                      <p className="text-green-600 font-bold text-lg mt-3">
                        ₹{item.books?.price}
                      </p>

                      <p className="mt-2">
                        Quantity:
                        <span className="font-semibold ml-2">
                          {item.quantity}
                        </span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div>

              <div className="bg-white rounded-xl shadow p-6 sticky top-24">

                <h2 className="text-2xl font-bold mb-6">
                  Order Summary
                </h2>

                <div className="flex justify-between mb-3">
                  <span>Items</span>
                  <span>{cart.length}</span>
                </div>

                <div className="flex justify-between mb-6">
                  <span>Total</span>

                  <span className="font-bold text-2xl text-green-600">
                    ₹{total}
                  </span>
                </div>

                <Link
                  to="/checkout"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-semibold"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  to="/books"
                  className="block mt-3 text-center border border-gray-300 py-3 rounded-lg hover:bg-gray-100"
                >
                  Continue Shopping
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