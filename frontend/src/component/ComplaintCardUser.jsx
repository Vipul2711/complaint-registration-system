import React from "react";

function ComplaintCardUser({ complaint, onClose, loadingId }) {
  const c = complaint;

  const formatDate = (date) => new Date(date).toLocaleString("en-IN");

  // Status configuration (kept distinct for clarity)
  const statusConfig = {
    SUBMITTED: {
      label: "Submitted",
      badge: "bg-blue-100 text-blue-700 border-blue-200",
      border: "border-blue-400",
    },
    ASSIGNED: {
      label: "Assigned",
      badge: "bg-amber-100 text-amber-700 border-amber-200",
      border: "border-amber-400",
    },
    IN_PROGRESS: {
      label: "In Progress",
      badge: "bg-orange-100 text-orange-700 border-orange-200",
      border: "border-orange-400",
    },
    RESOLVED: {
      label: "Resolved",
      badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
      border: "border-emerald-400",
    },
    CLOSED: {
      label: "Closed",
      badge: "bg-gray-100 text-gray-700 border-gray-200",
      border: "border-gray-400",
    },
  };

  const currentStatus = statusConfig[c.status] || statusConfig.SUBMITTED;

  const isClosable = () => {
    const createdTime = new Date(c.createdAt);
    return (new Date() - createdTime) / (1000 * 60 * 60) <= 24;
  };

  return (
    <div
      className={`bg-white border-l-4 ${currentStatus.border} rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <h3 className="text-sm font-semibold text-gray-900">
          Complaint #{c.id}
        </h3>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium border ${currentStatus.badge}`}
        >
          {currentStatus.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
        {c.description}
      </p>

      {/* Image */}
      {c.imageUrl && (
        <button
          onClick={() => window.open(c.imageUrl, "_blank")}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg mb-3 transition flex items-center gap-1"
        >
          <span>🖼️</span> View Image
        </button>
      )}

      {/* Meta */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>Created: {formatDate(c.createdAt)}</p>
        <p>
          Department:{" "}
          <span className="text-gray-700">
            {c.assignedDepartmentName || "Pending Assignment"}
          </span>
        </p>
      </div>

      {/* Location */}
      {c.latitude && (
        <a
          href={`https://www.google.com/maps?q=${c.latitude},${c.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-block hover:underline"
        >
          📍 View on Map
        </a>
      )}

      {/* Action */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        {c.status === "CLOSED" ? (
          <span className="text-xs text-gray-500 font-medium">Closed</span>
        ) : c.status === "RESOLVED" ? (
          <span className="text-xs text-emerald-600 font-medium">Resolved</span>
        ) : !isClosable() ? (
          <span className="text-xs text-gray-400">Cannot close after 24h</span>
        ) : (
          <button
            onClick={() => onClose(c.id)}
            disabled={loadingId === c.id}
            className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingId === c.id ? (
              <span className="flex items-center gap-1">
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Closing...
              </span>
            ) : (
              "Close Complaint"
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default ComplaintCardUser;