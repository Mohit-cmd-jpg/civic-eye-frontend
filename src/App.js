import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ReportPage from "./pages/ReportPage";
import TrackComplaint from "./pages/TrackComplaint";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ReportPage />} />
      <Route path="/track" element={<TrackComplaint />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
