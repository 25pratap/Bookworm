import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import {Eye,EyeOff} from "lucide-react";

function AdminLoginPage() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
  

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.detail || "Login failed");
                return;
            }

            const role = data.role?.trim().toLowerCase();

            if (role !== "admin") {
                toast.error("Only administrators can log in here.");
                localStorage.clear();
                return;
            }

            if (data.token){
                login(data);
                localStorage.setItem("token", data.token);
            }
            localStorage.setItem("role", role);
            localStorage.setItem("email", data.email);
            localStorage.setItem("name", data.name || "Admin");

            toast.success("Admin login successful");
            setTimeout(() => {
            navigate("/admin/dashboard");
            }, 1500);

        } catch (err) {
            console.error(err);
            toast.error("Server not reachable.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

                <h1 className="text-3xl font-bold text-center text-red-600 mb-2">
                    Admin Login
                </h1>

                <p className="text-center text-gray-500 mb-6">
                    Administrator Access Only
                </p>

                <form onSubmit={handleLogin} className="space-y-4">

                    <input
                        type="email"
                        placeholder="Admin Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded-lg p-3"
                        required
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 pr-10"
                            required
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-gray-500"
                        >
                            {showPassword ? (
                            <EyeOff size={20}/>
                            ) : (
                            <Eye size={20}/>
                            )}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg"
                    >
                        {loading ? "Signing In..." : "Admin Login"}
                    </button>

                </form>

            </div>
        </div>
    );
}

export default AdminLoginPage;