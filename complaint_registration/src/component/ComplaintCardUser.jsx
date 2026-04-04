import React from "react";

function ComplaintCardUser({ complaint, onClose, loadingId }) {
  const c = complaint;

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN");

  const statusMap = {
    SUBMITTED: "🟡 Submitted",
    ASSIGNED: "🔵 In Progress",
    RESOLVED: "✅ Resolved",
    CLOSED: "❌ Closed",
  };

  const getStatusLabel = () => statusMap[c.status] || c.status;

  const isClosable = () => {
    const createdTime = new Date(c.createdAt);
    const now = new Date();
    const diffHours = (now - createdTime) / (1000 * 60 * 60);
    return diffHours <= 24;
  };

  const handleCloseClick = () => onClose(c.id);

  const renderAction = () => {
    if (c.status === "CLOSED") {
      return <span style={{ color: "gray" }}>Already Closed</span>;
    }

    if (c.status === "RESOLVED") {
      return <span style={{ color: "green" }}>Already Resolved</span>;
    }

    if (!isClosable()) {
      return (
        <span style={{ color: "gray" }}>
          Cannot close after 24 hours
        </span>
      );
    }

    return (
      <button
        onClick={handleCloseClick}
        disabled={loadingId === c.id}
      >
        {loadingId === c.id ? "Closing..." : "Close"}
      </button>
    );
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        margin: "12px",
        padding: "15px",
        borderRadius: "10px",
        background: "#fff",
      }}
    >
      <p><b>ID:</b> {c.id}</p>

      <p><b>Description:</b> {c.description}</p>

      {/* ✅ VIEW IMAGE BUTTON */}
      {c.imageUrl && (
        <button
          onClick={() => window.open(c.imageUrl, "_blank")}
          style={{
            background: "#444",
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

      <p><b>Status:</b> {getStatusLabel()}</p>

      <p><b>Created:</b> {formatDate(c.createdAt)}</p>

      <p>
        <b>Department:</b>{" "}
        {c.assignedDepartmentName || "Pending Assignment"}
      </p>

      <p>
        <b>Priority:</b>{" "}
        <span
          style={{
            color: c.priority === "HIGH" ? "red" : "black",
            fontWeight: c.priority === "HIGH" ? "bold" : "normal",
          }}
        >
          {c.priority}
        </span>
      </p>

      {/* LOCATION */}
      {c.latitude != null && c.longitude != null && (
        <p>
          <b>Location:</b>{" "}
          <a
            href={`https://www.google.com/maps?q=${c.latitude},${c.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            📍 View on Map
          </a>
        </p>
      )}

      {/* ACTION */}
      <div style={{ marginTop: "10px" }}>
        {renderAction()}
      </div>
    </div>
  );
}

export default ComplaintCardUser;