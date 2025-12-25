import React, { useState } from "react";

const BACKEND_URL = "https://civic-eye-backend-tnsa.onrender.com";

function App() {
  const [image, setImage] = useState(null);
  const [issueType, setIssueType] = useState("road_block");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReport = async () => {
    if (!image) {
      setStatus("Please select an image.");
      return;
    }

    setLoading(true);
    setStatus("");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("issue_type", issueType);

    try {
      const response = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("✅ Report submitted successfully!");
      } else {
        setStatus("❌ Submission failed. Please try again.");
      }
    } catch (error) {
      setStatus("❌ Server error. Please try later.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Civic-Eye</h1>
      <p style={styles.subtitle}>
        Report civic issues in your area with photo proof
      </p>

      <div style={styles.card}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <select
          value={issueType}
          onChange={(e) => setIssueType(e.target.value)}
          style={styles.select}
        >
          <option value="road_block">Road Block</option>
          <option value="pothole">Pothole</option>
          <option value="garbage">Garbage</option>
          <option value="accident">Accident</option>
        </select>

        <button onClick={submitReport} style={styles.button}>
          {loading ? "Submitting..." : "Submit Report"}
        </button>

        {status && <p style={styles.status}>{status}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f4f6f8",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif"
  },
  title: {
    fontSize: "36px",
    marginBottom: "4px"
  },
  subtitle: {
    color: "#555",
    marginBottom: "24px"
  },
  card: {
    background: "#fff",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: "320px",
    textAlign: "center"
  },
  select: {
    width: "100%",
    marginTop: "12px",
    padding: "8px"
  },
  button: {
    marginTop: "16px",
    width: "100%",
    padding: "10px",
    backgroundColor: "#2b7cff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  },
  status: {
    marginTop: "12px"
  }
};

export default App;
