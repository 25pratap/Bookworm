import { API_BASE_URL } from "../config/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkout() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const placeOrder = async () => {

    if (
      !formData.name ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state
    ) {
      setMessage("Please fill all details");
      setMessageType("error");
      return;
    }


    try {

      setLoading(true);

      const token = localStorage.getItem("token");


      const response = await fetch(
        `${API_BASE_URL}/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },

          body: JSON.stringify(formData)
        }
      );


      const data = await response.json();


      if (!response.ok) {

        setMessage(data.detail || "Order failed");
        setMessageType("error");
        return;

      }


      setMessage("Order placed successfully");
      setMessageType("success");

     setTimeout(() => {
        navigate("/payment");
      }, 1500);

    } catch (error) {

      console.log(error);

      setMessage("Server error");
      setMessageType("error");

    } finally {

      setLoading(false);

    }

  };
const states = {
  "Koshi Province": [
    "Biratnagar",
    "Dharan",
    "Ilam",
    "Birtamode"
  ],
  "Madhesh Province": [
    "Janakpur",
    "Birgunj",
    "Rajbiraj"
  ],
  "Bagmati Province": [
    "Kathmandu",
    "Lalitpur",
    "Bhaktapur",
    "Hetauda"
  ],
  "Gandaki Province": [
    "Pokhara",
    "Baglung",
    "Gorkha"
  ],
  "Lumbini Province": [
    "Butwal",
    "Bhairahawa",
    "Nepalgunj"
  ],
  "Karnali Province": [
    "Surkhet",
    "Jumla"
  ],
  "Sudurpashchim Province": [
    "Dhangadhi",
    "Mahendranagar"
  ]
};


const handleStateChange = (e) => {
  setFormData({
    ...formData,
    state: e.target.value,
    city: ""
  });
};

  
return (

  <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">

    <h2 className="text-3xl font-bold text-center mb-6">
      Checkout Details
    </h2>
  {message && (
  <div
    className={`mb-5 p-4 rounded-lg text-center font-semibold ${
      messageType === "success"
        ? "bg-green-100 text-green-700 border border-green-300"
        : "bg-red-100 text-red-700 border border-red-300"
    }`}
  >
    {message}
  </div>
)}

    <table className="w-full border-collapse">

      <tbody>

        <tr className="border">
          <td className="p-4 font-semibold bg-gray-100">
            Full Name
          </td>

          <td className="p-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </td>
        </tr>


        <tr className="border">
          <td className="p-4 font-semibold bg-gray-100">
            Phone Number
          </td>

          <td className="p-4">
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </td>
        </tr>


        <tr className="border">
          <td className="p-4 font-semibold bg-gray-100">
            Address
          </td>

          <td className="p-4">
            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </td>
        </tr>

        <tr className="border">
          <td className="p-4 font-semibold bg-gray-100">
            State
          </td>

          <td className="p-4">
            <select
                name="state"
                value={formData.state}
                onChange={handleStateChange}
                className="w-full border rounded-lg p-2"
              >
                <option value="">
                  Select Province
                </option>

                {Object.keys(states).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}

              </select>

          </td>
        </tr>

        <tr className="border">
          <td className="p-4 font-semibold bg-gray-100">
            City
          </td>

          <td className="p-4">

            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              disabled={!formData.state}
            >

              <option value="">
                Select City
              </option>

              {formData.state &&
                states[formData.state].map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))
              }

            </select>

          </td>
        </tr>

      </tbody>

    </table>


    <button
      onClick={placeOrder}
      disabled={loading}
      className="w-full mt-6 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
    >
      {loading ? "Processing..." : "Continue to Payment"}
    </button>


  </div>

);
}
export default Checkout;
