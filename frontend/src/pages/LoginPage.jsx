import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch("http://127.0.0.1:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.message === "Login successful") {
            alert(data.message);

            // save token (IMPORTANT if backend sends it)
            if (data.token) {
                login(data.token);
            }


            if (data.role) {
                localStorage.setItem("role", data.role?.trim().toLowerCase());
            }

            // role-based redirect
            if (data.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/books");
            }

        } else {
            alert("Invalid email or password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

                <h1 className="text-3xl font-bold text-center mb-6">
                    Welcome Back
                </h1>

                <form onSubmit={handleLogin} className="space-y-4">

                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full border rounded-lg p-3"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Enter your password"
                        className="w-full border rounded-lg p-3"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
                    >
                        Login
                    </button>

                </form>

                <p className="text-center mt-4 text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
                        Sign Up
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default LoginPage;