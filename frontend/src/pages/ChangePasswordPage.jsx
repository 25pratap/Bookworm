import { API_BASE_URL } from "../config/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ChangePasswordPage() {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const email = localStorage.getItem("email");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const res = await fetch(`${API_BASE_URL}/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message);
      navigate("/books");
    } else {
      toast.error(data.detail);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Change Password
        </h2>

        <input
          type="password"
          placeholder="Old Password"
          className="w-full border p-3 rounded mb-4"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-3 rounded mb-4"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full border p-3 rounded mb-6"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}

export default ChangePasswordPage;