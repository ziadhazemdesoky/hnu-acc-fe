// src/context/AuthContext.js
import React, { createContext, useState, useContext } from "react";
import Cookies from "js-cookie";

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  // Initialize isLoggedIn based on the presence of the authToken cookie
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("authToken"));

  // Login function
  const login = (token) => {
    Cookies.set("authToken", token, { expires: 1, secure: true, sameSite: "Strict" }); // Set token with 1-day expiry
    setIsLoggedIn(true);
  };

  // Logout function
  const logout = () => {
    Cookies.remove("authToken");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = () => useContext(AuthContext);
