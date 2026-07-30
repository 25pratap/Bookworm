import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function OrdersPage() {

  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {

    const getOrders = async () => {

      const token = localStorage.getItem("token");


      const response = await fetch(
        "http://localhost:8000/delivery",
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );


      const data = await response.json();


      if (response.ok) {
        setOrders(data);
      }

    };

    getOrders();

  }, []);
 const cancelOrder = async () => {

  const confirmed = window.confirm(
    "Are you sure you want to cancel this order?"
  );

  if (!confirmed) {
    return;
  }

  try {

    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:8000/orders/cancel",
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.detail || "Failed to cancel order");
      return;
    }

    toast.success("Order cancelled successfully");

    setOrders((prev) =>
      prev.map((order) =>
        order.status === "Pending"
          ? { ...order, status: "Cancelled" }
          : order
      )
    );
    setTimeout(() => {
      navigate("/books");
    }, 1500);

  } catch (error) {

    console.log(error);

    toast.error("Failed to cancel order");

  }

};

  return (

    <div className="max-w-5xl mx-auto mt-10 p-8">

      <h1 className="text-3xl font-bold mb-6">
        My Orders
      </h1>


      {
        orders.length === 0 ?

        (
          <p>No orders found</p>
        )

        :

        (

          orders.map((order)=> (

            <div
              key={order.id}
              className="border rounded-lg p-5 mb-5 shadow"
            >

              <h2 className="text-xl font-bold">
                {order.name}
              </h2>


              <p>
                Book ID: {order.book_id}
              </p>


              <p>
                Quantity: {order.quantity}
              </p>


              <p>
                Address:
                {order.address},
                {order.city},
                {order.state}
              </p>


              <p>
                Payment:
                {order.payment_method || "Not paid"}
              </p>


              <p>
                Status:
                <span className="font-bold ml-2">
                  {order.status}
                </span>
              </p>


          {
          order.status === "Pending" && (

            <div className="mt-4 flex gap-3">

              <button
                onClick={() => navigate("/payment")}
                className="bg-blue-600 text-white px-5 py-2 rounded"
              >
                Continue Payment
              </button>

              <button
                onClick={cancelOrder}
                className="bg-red-600 text-white px-5 py-2 rounded"
              >
                Cancel Order
              </button>

            </div>

          )
        }


            </div>

          ))

        )

      }


    </div>

  );

}
export default OrdersPage;