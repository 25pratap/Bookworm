import { createContext, useState, } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));
  const [loading, setLoading] = useState(true);


  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("email", data.email);
    localStorage.setItem("name", data.name);

    setToken(data.token);
    setRole(data.role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    setToken(null);
    setRole(null)
  };

  return (
    <AuthContext.Provider 
      value={{ 
        token,
        role, 
        login,
        logout, 
        loading,
        }}
      >
      {children}
    </AuthContext.Provider>
  );
}