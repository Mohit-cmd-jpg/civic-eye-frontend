import React, { useState } from "react";

const BACKEND_URL = "https://civic-eye-backend-tnsa.onrender.com";

function CitizenPage() {
  const [image, setImage] = useState(null);
  const [issueType, setIssueType] = useState("road_block");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReport = async () => {
    if (!image) {
      setStatus("❌ Please select an image.");
      return;
    }

    setLoading(true);
    setStatus("");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("issue_type", issueType);
    formData.append("description", description);

    try {
      const response = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus(`❌ ${data.message || "Submission failed"}`);
      } else {
        setStatus("✅ Report submitted successfully!");
        setImage(null);
        setDescription("");
      }
    } catch {
      setStatus("❌ Server error. Please retry.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1>Civic-Eye</h1>
      <p>Report civic issues in your area with photo proof</p>

      <div style={styles.card}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <select
          value={issueType}
          onChange={(e) => setIssueType(e.target.value)}
        >
          <option value="road_block">Road Block</option>
          <option value="pothole">Pothole</option>
          <option value="garbage">Garbage</option>
          <option value="accident">Accident</option>
        </select>

        <textarea
          placeholder="Describe the issue (optional but helpful)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
        />

        <button onClick={submitReport} disabled={loading}>
          {loading ? "Submitting..." : "Submit Report"}
        </button>

        {status && <p>{status}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    textAlign: "center"
  },
  card: {
    display: "inline-block",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    width: "320px"
  },
  textarea: {
    width: "100%",
    height: "80px",
    marginTop: "10px",
    padding: "8px"
  }
};

export default CitizenPage;
