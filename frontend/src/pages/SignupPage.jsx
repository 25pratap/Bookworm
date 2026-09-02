import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
 
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if(!name.trim()){
      toast.error("Name is required!");
      return;
    }

    if(!email.trim()){
      toast.error("Email is required!");
      return;
    }

    if(!password.trim()){
      toast.error("Password is required!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    if(!confirmPassword.trim()){
      toast.error("Please confirm your password!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

  try{
    const res = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        password,
        age: age ? Number(age) : null,
        gender,
        role: "user",
      }),
    });

   const data = await res.json();

    if (res.ok) {

      toast.success("Account created successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } else {
      console.log(data);
      toast.error(data.detail || "Signup failed");
    }
  } catch (error) {
    console.error("Error during signup:", error);
    toast.error("An error occurred during signup. Please try again.");
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5"
      >
        <h2 className="text-3xl font-bold text-center mb-2">
          Sign Up
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

      {/*password*/} 
      <div className ="relative">
        <input
          type={showPassword ? "text":"password"}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
         className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      
        <button
          type="button"
          onClick={()=>setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={20}/> :<Eye size={20}/>}
        </button>
      </div>
        
     {/* confirmpassword*/} 
      <div className ="relative">
        <input
          type={showConfirmPassword ? "text":"password"}
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="button"
          onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showConfirmPassword ? <EyeOff size={20}/> :<Eye size={20}/>}
        </button>
      </div>
       

        <input
          type="number"
          min="1"
          max="120"
          placeholder="Age (optional)"
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <select
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default SignUpPage;