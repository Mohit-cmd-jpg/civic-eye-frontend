import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import CitizenPage from "./CitizenPage";
import Dashboard from "./Dashboard";

function App() {
  return (
    <>
      <nav style={styles.nav}>
        <Link to="/" style={styles.link}>Report Issue</Link>
        <Link to="/dashboard" style={styles.link}>Authority Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/" element={<CitizenPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

const styles = {
  nav: {
    padding: "12px",
    backgroundColor: "#1f2937",
    display: "flex",
    gap: "16px"
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold"
  }
};

export default App;
