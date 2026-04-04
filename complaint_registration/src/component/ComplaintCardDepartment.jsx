import React from "react";

function ComplaintCardDepartment({ complaint, onStart, onResolve, loadingId }) {
  const c = complaint;

  const formatDate = (date) => new Date(date).toLocaleString();

  const getStatusColor = () => {
    if (c.status === "ASSIGNED") return "#f39c12";
    if (c.status === "IN_PROGRESS") return "#3498db";
    if (c.status === "RESOLVED") return "#2ecc71";
    return "#555";
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        margin: "15px 0",
        padding: "20px",
        borderRadius: "12px",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h4>Complaint #{c.id}</h4>
        <span
          style={{
            background: getStatusColor(),
            color: "#fff",
            padding: "4px 10px",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        >
          {c.status}
        </span>
      </div>

      {/* DESCRIPTION */}
      <p style={{ margin: "10px 0" }}>{c.description}</p>

      {/* ✅ VIEW IMAGE BUTTON */}
      {c.imageUrl && (
        <button
          onClick={() => window.open(c.imageUrl, "_blank")}
          style={{
            background: "#555",
            color: "#fff",
            border: "none",
            padding: "6px 10px",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "10px",
          }}
        >
          👁 View Image
        </button>
      )}

      {/* DETAILS */}
      <div style={{ fontSize: "14px", color: "#555" }}>
        <p><b>User:</b> {c.submittedByUsername}</p>
        <p><b>Submitted:</b> {formatDate(c.submittedAt)}</p>

        <p>
          <b>Priority:</b>{" "}
          <span
            style={{
              color: c.priority === "HIGH" ? "red" : "#333",
              fontWeight: c.priority === "HIGH" ? "bold" : "normal",
            }}
          >
            {c.priority}
          </span>
        </p>
      </div>

      {/* LOCATION */}
      {c.latitude && c.longitude && (
        <p>
          📍{" "}
          <a
            href={`https://www.google.com/maps?q=${c.latitude},${c.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Location
          </a>
        </p>
      )}

      {/* ACTION BUTTONS */}
      <div style={{ marginTop: "15px" }}>
        {c.status === "ASSIGNED" && (
          <button
            onClick={() => onStart(c.id)}
            disabled={loadingId === c.id}
            style={{
              background: "#3498db",
              color: "#fff",
              border: "none",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {loadingId === c.id ? "Starting..." : "Start Work"}
          </button>
        )}

        {c.status === "IN_PROGRESS" && (
          <button
            onClick={() => onResolve(c.id)}
            disabled={loadingId === c.id}
            style={{
              background: "#2ecc71",
              color: "#fff",
              border: "none",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          >
            {loadingId === c.id ? "Resolving..." : "Mark Resolved"}
          </button>
        )}
      </div>
    </div>
  );
}

export default ComplaintCardDepartment;