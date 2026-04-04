import React, { useState } from "react";

function ComplaintCardAdmin({
  complaint,
  type = "admin",
  onClose,
  onAssign,
  loadingId,
  departments = [],
}) {
  const c = complaint;

  const [showAssign, setShowAssign] = useState(false);
  const [selectedDept, setSelectedDept] = useState("");

  const formatDate = (date) => new Date(date).toLocaleString();

  const getStatusColor = () => {
    if (c.status === "SUBMITTED") return "orange";
    if (c.status === "ASSIGNED") return "blue";
    if (c.status === "RESOLVED") return "green";
    return "red";
  };

  const isUnassigned =
    !c.assignedDepartmentName ||
    c.assignedDepartmentName === "Unassigned";

  return (
    <div
      style={{
        border: "1px solid #ccc",
        margin: "12px",
        padding: "15px",
        borderRadius: "10px",
        background: "#f9f9f9",
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

      {type === "admin" && (
        <>
          <p><b>User:</b> {c.submittedByUsername || "Unknown"}</p>
          <p><b>Submitted At:</b> {formatDate(c.submittedAt)}</p>

          <p>
            <b>Pending Days:</b>{" "}
            {Math.floor(
              (new Date() - new Date(c.submittedAt)) /
              (1000 * 60 * 60 * 24)
            )}
          </p>
        </>
      )}

      <p>
        <b>Status:</b>{" "}
        <span style={{ color: getStatusColor(), fontWeight: "bold" }}>
          {c.status}
        </span>
      </p>

      {type === "admin" && (
        <p>
          <b>Department:</b>{" "}
          {c.assignedDepartmentName || "Not Assigned"}
        </p>
      )}

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

      {type === "admin" && c.latitude && c.longitude && (
        <p>
          <b>Location:</b>{" "}
          <a
            href={`https://www.google.com/maps?q=${c.latitude},${c.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            📍 Open in Maps
          </a>
        </p>
      )}

      {/* ASSIGN */}
      {type === "admin" &&
        c.status === "SUBMITTED" &&
        isUnassigned && (
          <div style={{ marginTop: "10px" }}>
            <button onClick={() => setShowAssign(!showAssign)}>
              Assign Department
            </button>

            {showAssign && (
              <div style={{ marginTop: "10px" }}>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    if (!selectedDept) {
                      alert("Select department");
                      return;
                    }
                    onAssign(c.id, selectedDept);
                    setShowAssign(false);
                    setSelectedDept("");
                  }}
                  style={{ marginLeft: "10px" }}
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
        )}

      {/* CLOSE */}
      {type === "admin" && onClose && (
        <button
          onClick={() => onClose(c.id)}
          disabled={
            loadingId === c.id ||
            c.status === "CLOSED" ||
            c.status === "RESOLVED"
          }
          style={{ marginTop: "10px" }}
        >
          {loadingId === c.id
            ? "Processing..."
            : c.status === "CLOSED"
            ? "Closed"
            : "Close Complaint"}
        </button>
      )}
    </div>
  );
}

export default ComplaintCardAdmin;