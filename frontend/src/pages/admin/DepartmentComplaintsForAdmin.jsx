import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/useAdmin";
import ComplaintCard from "../../component/ComplaintCardAdmin";

function DepartmentComplaintsForAdmin() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const deptName = location.state?.name || "Department";

  const { complaints, totalPages, fetchComplaints } = useAdmin();

  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchComplaints({
      page,
      sortBy,
      sortDir,
      deptId: id,
      status,
    });
  }, [id, page, sortBy, sortDir, status]);

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header with back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/departments")}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium mb-3 flex items-center gap-1"
          >
            ← Back to Departments
          </button>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Department Complaints
          </h1>
          <p className="text-gray-500 mt-1">
            Viewing complaints for{" "}
            <span className="font-semibold text-blue-600">{deptName}</span>
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-end gap-4">
            {/* Sort By */}
            <div className="flex flex-col min-w-[150px]">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setPage(0);
                  setSortBy(e.target.value);
                }}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition cursor-pointer"
              >
                <option value="createdAt">Created Date</option>
                <option value="status">Status</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            {/* Sort Direction */}
            <div className="flex flex-col min-w-[120px]">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Order
              </label>
              <button
                onClick={() => {
                  setPage(0);
                  setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
                }}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                {sortDir === "asc" ? "Ascending ↑" : "Descending ↓"}
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex flex-col min-w-[150px]">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={status || null}
                onChange={(e) => {
                  setPage(0);
                  setStatus(e.target.value || null);
                }}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        {complaints.length > 0 ? (
          <div className="space-y-4">
            {complaints.map((c) => (
              <ComplaintCard key={c.id} complaint={c} type="admin" />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-5xl mb-3">📋</div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              No complaints found
            </h3>
            <p className="text-sm text-gray-500">
              This department has no complaints matching the filters.
            </p>
          </div>
        )}

        {/* Pagination */}
        {complaints.length > 0 && (
          <div className="mt-6 flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
              className="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <span className="text-sm text-gray-600">
              Page <span className="font-semibold">{page + 1}</span> of{" "}
              {totalPages || 1}
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page + 1 === totalPages}
              className="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DepartmentComplaintsForAdmin;