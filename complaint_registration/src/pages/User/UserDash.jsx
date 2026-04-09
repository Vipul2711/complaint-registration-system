import { useUser } from "../../context/UserContext";

function UserDash() {
  const { complaints, stats, loading, error } = useUser();

  const cards = [
    { title: "Total", value: stats.total, color: "bg-blue-600" },
    { title: "Submitted", value: stats.submitted, color: "bg-blue-500" },
    { title: "Assigned", value: stats.assigned, color: "bg-amber-500" },
    { title: "In Progress", value: stats.inProgress, color: "bg-orange-500" },
    { title: "Resolved", value: stats.resolved, color: "bg-emerald-500" },
    { title: "Closed", value: stats.closed, color: "bg-gray-500" },
  ];

  const recentComplaints = complaints.slice(0, 5);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-blue-100 text-blue-700";
      case "ASSIGNED":
        return "bg-amber-100 text-amber-700";
      case "IN_PROGRESS":
        return "bg-orange-100 text-orange-700";
      case "RESOLVED":
        return "bg-emerald-100 text-emerald-700";
      case "CLOSED":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatStatus = (status) =>
    status
      ?.toLowerCase()
      .replace("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's an overview of your complaints.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-200"
            >
              <div className={`w-8 h-1 ${card.color} rounded-full mb-3`} />
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Complaints */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Complaints</h2>
            <p className="text-sm text-gray-500">Your latest submitted issues</p>
          </div>

          {recentComplaints.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-3">📋</div>
              <p className="text-gray-500 font-medium">No complaints yet.</p>
              <p className="text-sm text-gray-400 mt-1">
                File your first complaint to get started.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentComplaints.map((c) => (
                <div
                  key={c.id}
                  className="p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono font-medium text-gray-600">
                        #{c.id}
                      </span>
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusStyle(
                          c.status
                        )}`}
                      >
                        {formatStatus(c.status)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-2 mb-3">
                    {c.description}
                  </p>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500">
                      <span className="font-medium text-gray-700">Department:</span>{" "}
                      {c.assignedDepartmentName || (
                        <span className="text-gray-400">Not assigned</span>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDash;