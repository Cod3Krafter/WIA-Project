import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { jwtDecode } from "jwt-decode"; 

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          // Token is expired, remove it
          localStorage.removeItem("accessToken");
          setIsAuthenticated(false);
          setUser(null);
        } else {
          // Token is valid, restore auth state
          setIsAuthenticated(true);
          setUser(decoded);
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
      setUser(decoded.user);
    } catch (err) {
      console.error("Failed to decode token on login:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    setUser(null);
  };

  // Don't render children until we've checked for existing auth
  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};