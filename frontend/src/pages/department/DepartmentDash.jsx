import { useEffect } from "react";
import { useDepartment } from "../../context/useDepartment";

const DepartmentDash = () => {
  const { state, fetchAllComplaints } = useDepartment();
  const { allComplaints } = state;

  useEffect(() => {
    if (allComplaints.length === 0) {
      fetchAllComplaints();
    }
  }, []);

  const normalize = (s) => s?.trim().toUpperCase();

  const stats = {
    total: allComplaints.length,
    assigned: allComplaints.filter((c) => normalize(c.status) === "ASSIGNED")
      .length,
    inProgress: allComplaints.filter(
      (c) => normalize(c.status) === "IN_PROGRESS"
    ).length,
    resolved: allComplaints.filter((c) => normalize(c.status) === "RESOLVED")
      .length,
    closed: allComplaints.filter((c) => normalize(c.status) === "CLOSED")
      .length,
  };

  const cards = [
    { title: "Total", value: stats.total, color: "bg-blue-600" },
    { title: "Assigned", value: stats.assigned, color: "bg-amber-500" },
    { title: "In Progress", value: stats.inProgress, color: "bg-orange-500" },
    { title: "Resolved", value: stats.resolved, color: "bg-emerald-500" },
    { title: "Closed", value: stats.closed, color: "bg-gray-500" },
  ];

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

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid Date";
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Department Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of complaints assigned to your department.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Complaints</h2>
            <p className="text-sm text-gray-500">Latest issues assigned to your department</p>
          </div>

          {allComplaints.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-3">📋</div>
              <p className="text-gray-500 font-medium">No complaints assigned yet.</p>
              <p className="text-sm text-gray-400 mt-1">New complaints will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {allComplaints
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map((c) => (
                  <div key={c.id} className="p-5 hover:bg-gray-50 transition-colors">
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
                          {c.status.replace("_", " ")}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatDate(c.submittedAt || c.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                      {c.description}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentDash;