import { API_BASE_URL } from "../config/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


function PaymentPage() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const makePayment = async (method) => {
     // eSewa is only displayed as a payment option
      if (method === "eSewa" || method == "Khalti"){
        toast.info(
          `${method} payment is not integrated yet.`
        );
        return;
    }

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
              `${API_BASE_URL}/orders/payment`,
              {
                method: "PUT",

                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                  payment_method: method
                })
              }
            );


      const data = await response.json();


      if (!response.ok) {
        throw new Error(data.detail || "Payment failed");
      }


      toast.success("Order confirmed successfully");
      setTimeout(() => {
        navigate("/delivery");
      }, 1500);

    } catch (error) {

      console.log(error);

      toast.error(error.message || "Payment failed");

    } finally {

      setLoading(false);

    }

  };
  const cancelPayment = async () => {

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/orders/cancel`,
        {
          method: "PUT",

          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail);
        return;
      }

      toast.success("Order cancelled");

      setTimeout(() => {
        navigate("/books");
      }, 1500);

    } catch (error) {

      console.log(error);

      toast.error("Failed to cancel order");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow rounded-lg">

      <h1 className="text-3xl font-bold mb-4">
        Payment
      </h1>


      <p className="text-gray-600 mb-6">
        Select your payment method
      </p>


      <div className="space-y-3">


        <button
          onClick={() => makePayment("Cash on Delivery")}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Cash on Delivery
        </button>


        <button
          onClick={() => makePayment("eSewa")}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          eSewa
        </button>



        <button
          onClick={() => makePayment("Khalti")}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded"
        >
          Khalti
        </button>

        <button
          onClick={cancelPayment}
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 rounded"
        >
          Cancel Payment
        </button>

      </div>


    </div>

  );
}


export default PaymentPage;