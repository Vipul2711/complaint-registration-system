import { useEffect } from "react";
import { useAdmin } from "../../context/useAdmin";

function AdminDash() {
  const { stats, fetchStats } = useAdmin();

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    { title: "Total", value: stats.total, color: "bg-blue-600" },
    { title: "Submitted", value: stats.submitted, color: "bg-blue-500" },
    { title: "Assigned", value: stats.assigned, color: "bg-amber-500" },
    { title: "In Progress", value: stats.inProgress, color: "bg-orange-500" },
    { title: "Resolved", value: stats.resolved, color: "bg-emerald-500" },
    { title: "Closed", value: stats.closed, color: "bg-gray-500" },
    { title: "Departments", value: stats.departments, color: "bg-indigo-500" },
  ];

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">System-wide overview and statistics.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
      </div>
    </div>
  );
}

export default AdminDash;