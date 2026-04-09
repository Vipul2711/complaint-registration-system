import React, { useState } from "react";

function ComplaintCardAdmin({
  complaint,
  onClose,
  onAssign,
  loadingId,
  departments = [],
}) {
  const c = complaint;

  const [showAssign, setShowAssign] = useState(false);
  const [selectedDept, setSelectedDept] = useState("");

  const formatDate = (date) => new Date(date).toLocaleString("en-IN");

  // Status configuration with left border accent
  const statusConfig = {
    SUBMITTED: {
      border: "border-l-4 border-blue-400",
      badge: "bg-blue-100 text-blue-700",
    },
    ASSIGNED: {
      border: "border-l-4 border-amber-400",
      badge: "bg-amber-100 text-amber-700",
    },
    IN_PROGRESS: {
      border: "border-l-4 border-orange-400",
      badge: "bg-orange-100 text-orange-700",
    },
    RESOLVED: {
      border: "border-l-4 border-emerald-400",
      badge: "bg-emerald-100 text-emerald-700",
    },
    CLOSED: {
      border: "border-l-4 border-gray-400",
      badge: "bg-gray-100 text-gray-700",
    },
  };

  const priorityConfig = {
    LOW: "text-gray-500",
    NORMAL: "text-blue-600 font-medium",
    HIGH: "text-amber-600 font-medium",
  };

  const isUnassigned =
    !c.assignedDepartmentName || c.assignedDepartmentName === "Unassigned";

  const currentStatus = statusConfig[c.status] || statusConfig.SUBMITTED;

  return (
    <div
      className={`bg-white rounded-xl p-5 shadow-sm ${currentStatus.border} hover:shadow-md transition-all duration-200`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900">
              Complaint #{c.id}
            </h3>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${currentStatus.badge}`}
            >
              {c.status.replace("_", " ")}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{formatDate(c.submittedAt)}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 leading-relaxed mb-4">
        {c.description}
      </p>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">User</p>
          <p className="font-medium text-gray-800">{c.submittedByUsername}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Priority</p>
          <p className={`font-medium ${priorityConfig[c.priority] || "text-gray-700"}`}>
            {c.priority}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Department</p>
          <p className="font-medium text-gray-800">
            {c.assignedDepartmentName || "Unassigned"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Days</p>
          <p className="font-medium text-gray-800">
            {Math.floor(
              (new Date() - new Date(c.submittedAt)) / (1000 * 60 * 60 * 24)
            )}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {c.imageUrl && (
          <button
            onClick={() => window.open(c.imageUrl, "_blank")}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition flex items-center gap-1"
          >
            🖼️ View Image
          </button>
        )}

        {c.latitude && c.longitude && (
          <a
            href={`https://www.google.com/maps?q=${c.latitude},${c.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg transition flex items-center gap-1"
          >
            📍 View on Map
          </a>
        )}
      </div>

      {/* Assign Section */}
      {c.status === "SUBMITTED" && isUnassigned && (
        <div className="mt-3">
          {!showAssign ? (
            <button
              onClick={() => setShowAssign(true)}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition"
            >
              Assign Department
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  if (!selectedDept) return alert("Please select a department");
                  onAssign(c.id, selectedDept);
                  setShowAssign(false);
                  setSelectedDept("");
                }}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowAssign(false)}
                className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Close Button */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={() => onClose(c.id)}
          disabled={
            loadingId === c.id ||
            c.status === "CLOSED" ||
            c.status === "RESOLVED"
          }
          className={`text-xs px-4 py-1.5 rounded-lg transition ${
            c.status === "CLOSED" || c.status === "RESOLVED"
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-600 hover:bg-gray-700 text-white"
          }`}
        >
          {loadingId === c.id
            ? "Processing..."
            : c.status === "CLOSED" || c.status === "RESOLVED"
            ? "Closed"
            : "Close Complaint"}
        </button>
      </div>
    </div>
  );
}

export default ComplaintCardAdmin;