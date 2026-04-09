import React from "react";

function DepartmentComplaintCard({ complaint, onStart, onResolve, loadingId }) {
  const c = complaint;

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN");

  // 🎯 SAME COLORS AS USER PANEL
  const statusConfig = {
    SUBMITTED: {
      label: "Submitted",
      badge: "bg-blue-100 text-blue-700 border-blue-300",
      border: "border-blue-500",
    },
    ASSIGNED: {
      label: "Assigned",
      badge: "bg-yellow-100 text-yellow-700 border-yellow-300",
      border: "border-yellow-500",
    },
    IN_PROGRESS: {
      label: "In Progress",
      badge: "bg-orange-100 text-orange-700 border-orange-300",
      border: "border-orange-500",
    },
    RESOLVED: {
      label: "Resolved",
      badge: "bg-green-100 text-green-700 border-green-300",
      border: "border-green-500",
    },
    CLOSED: {
      label: "Closed",
      badge: "bg-red-100 text-red-700 border-red-300",
      border: "border-red-500",
    },
  };

  const currentStatus =
    statusConfig[c.status] || statusConfig.SUBMITTED;

  return (
    <div
      className={`bg-white border ${currentStatus.border} border-l-4 rounded-xl p-5 shadow-sm`}
    >
      {/* HEADER */}
      <div className="flex justify-between mb-3">
        <h2 className="text-sm font-semibold">
          Complaint #{c.id}
        </h2>

        <span
          className={`text-xs px-3 py-1 rounded-full border ${currentStatus.badge}`}
        >
          {currentStatus.label}
        </span>
      </div>

      {/* DESCRIPTION */}
      <p className="text-sm text-gray-600 mb-3">
        {c.description}
      </p>

      {/* META */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>User: {c.userName}</p>
        <p>Submitted: {formatDate(c.submittedAt)}</p>
      </div>

      {/* IMAGE */}
      {c.imageUrl && (
        <button
          onClick={() => window.open(c.imageUrl, "_blank")}
          className="text-xs bg-black text-white px-3 py-1 rounded mt-3"
        >
          View Image
        </button>
      )}

      {/* LOCATION */}
      {c.latitude && (
        <a
          href={`https://www.google.com/maps?q=${c.latitude},${c.longitude}`}
          target="_blank"
          rel="noreferrer"
          className="block text-xs text-blue-600 mt-2"
        >
          View Location
        </a>
      )}

      {/* ACTIONS */}
      <div className="mt-4 flex gap-2">
        {c.status === "ASSIGNED" && (
          <button
            onClick={() => onStart(c.id)}
            disabled={loadingId === c.id}
            className="text-xs bg-blue-600 text-white px-3 py-1 rounded"
          >
            {loadingId === c.id ? "Starting..." : "Start Work"}
          </button>
        )}

        {c.status === "IN_PROGRESS" && (
          <button
            onClick={() => onResolve(c.id)}
            disabled={loadingId === c.id}
            className="text-xs bg-green-600 text-white px-3 py-1 rounded"
          >
            {loadingId === c.id ? "Resolving..." : "Resolve"}
          </button>
        )}
      </div>
    </div>
  );
}

export default DepartmentComplaintCard;