import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Eye , EyeOff } from "lucide-react";

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword ,setShowPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
  

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
         
        try {
            const response = await fetch("http://127.0.0.1:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.detail || data.message || "Login failed");
                return;
            }

            if (data.message !== "Login successful") {
                toast.error("Invalid email or password");
                return;
            }

            toast.success("Login successful");
            // Save token
            if (data.token) {
                login(data);
            }

            // Normalize role
            const role = data.role?.trim().toLowerCase();
            localStorage.setItem("role", role || "user");
            localStorage.setItem("email", data.email || "");
        

          // Don't allow admins here
            if (role === "admin") {
                toast.error("Please use the Admin Login page.");
                localStorage.clear();
                return;
            }

            setTimeout(() => {

            if (!data.favorite_genres || data.favorite_genres.length === 0) {
                    navigate("/preferences");
                } else {
                    navigate("/books");
                }

            }, 1500);
        
        } catch (err) {
            console.error(err);
            toast.error("Server not reachable. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

                <h1 className="text-3xl font-bold text-center mb-6">
                    Welcome Back
                </h1>

                <form onSubmit={handleLogin} className="space-y-4">
                    
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder ="Enter your password"
                            className= "w-full border rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value ={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type ="button"
                            onClick={() => setShowPassword (!showPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff size ={20}/> : <Eye size ={20}/>}
                        </button>
                    </div>
                       
                    

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full p-3 rounded-lg text-white transition ${
                    
                            loading
                                ? "bg-blue-300 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-center mt-4 text-gray-600">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;