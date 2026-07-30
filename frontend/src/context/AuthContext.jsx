import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role")
    
    if (savedToken) {
      setToken(savedToken);
    }
    if(savedRole){
      setRole(savedRole);
    }

    setLoading(false);
  }, []);

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
        loading 
        }}
      >
      {children}
    </AuthContext.Provider>
  );
}