// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AnimatedSidebar from "./components/AnimatedSidebar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import OperationMakerPage from "./pages/OperationMakerPage";
import OperationRecordPage from "./pages/OperationRecordPage";
import ApprovalPage from "./pages/ApprovalPage"; // Import the Approval Page
import { useAuth } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      {isLoggedIn && <AnimatedSidebar />}
      <div className={`${isLoggedIn ? "mr-64" : "mr-0"} transition-all duration-300`}>
        <ErrorBoundary>
          <Routes>
            <Route
              path="/login"
              element={!isLoggedIn ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route
              path="/"
              element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/operation-makers"
              element={isLoggedIn ? <OperationMakerPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/operation-records"
              element={isLoggedIn ? <OperationRecordPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/approval"
              element={isLoggedIn ? <ApprovalPage /> : <Navigate to="/login" />}
            />
            {/* Redirect any unknown routes to home or login */}
            <Route
              path="*"
              element={isLoggedIn ? <Navigate to="/" /> : <Navigate to="/login" />}
            />
          </Routes>
        </ErrorBoundary>
      </div>
    </Router>
  );
};

export default App;
