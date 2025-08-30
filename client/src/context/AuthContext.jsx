import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { jwtDecode } from "jwt-decode"; 
import LoadingPage from "../components/LoadingPage";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activeRole, setActiveRole] = useState(null); // ✅ Add this
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const savedRole = localStorage.getItem("userRole");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp < currentTime) {
          localStorage.removeItem("accessToken");
          setIsAuthenticated(false);
          setUser(null);
        } else {
          setIsAuthenticated(true);
          setUser(decoded);
          setActiveRole(savedRole || decoded.role);
        }
      } catch (err) {
        console.error("Failed to decode token on init:", err);
        localStorage.removeItem("accessToken");
        setIsAuthenticated(false);
        setUser(null);
      }
    }

    setIsLoading(false);
  }, []);

  const login = (token) => {
    try {
      const decoded = jwtDecode(token);
      localStorage.setItem("accessToken", token);
      setIsAuthenticated(true);
      setUser(decoded);
      console.log(decoded)
      setActiveRole(decoded.role); // ✅ Set role on login
      localStorage.setItem("userRole", decoded.role);
    } catch (err) {
      console.error("Failed to decode token on login:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    setUser(null);
    setActiveRole(null);
  };

  const switchRole = (newRole) => {
    if (!user) return;
    setActiveRole(newRole);
    localStorage.setItem("userRole", newRole);
  };

  if (isLoading) return <LoadingPage />;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, activeRole, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};
