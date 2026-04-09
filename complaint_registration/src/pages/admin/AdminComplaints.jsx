import { useEffect, useState } from "react";
import ComplaintCard from "../../component/ComplaintCardAdmin";
import { useAdmin } from "../../context/useAdmin";
import Toast from "../../component/Toast";

function AdminComplaints() {
  const {
    complaints,
    departments,
    totalPages,
    fetchComplaints,
    fetchDepartments,
    assignComplaint,
    closeComplaint,
    totalElements,
  } = useAdmin();

  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [status, setStatus] = useState("ALL");
  const [priority, setPriority] = useState("ALL");
  const [toast, setToast] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    fetchComplaints({ page, sortBy, sortDir, status, priority });
    fetchDepartments();
  }, [page, sortBy, sortDir, status, priority]);

  const handleAssign = async (id, deptId) => {
    setLoadingId(id);
    try {
      await assignComplaint(id, deptId);
      setToast({ message: "Complaint assigned successfully", type: "success" });
      fetchComplaints({ page, sortBy, sortDir, status, priority });
    } catch {
      setToast({ message: "Failed to assign complaint", type: "error" });
    } finally {
      setLoadingId(null);
    }
  };

  const handleClose = async (id) => {
    if (!window.confirm("Close this complaint?")) return;
    setLoadingId(id);
    try {
      await closeComplaint(id);
      setToast({ message: "Complaint closed successfully", type: "success" });
      fetchComplaints({ page, sortBy, sortDir, status, priority });
    } catch {
      setToast({ message: "Failed to close complaint", type: "error" });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              All Complaints
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Total complaints: <span className="font-semibold text-gray-700">{totalElements || 0}</span>
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-wrap items-center gap-3">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value);
              setPage(0);
            }}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition cursor-pointer"
          >
            <option value="ALL">All Priority</option>
            <option value="LOW">Low</option>
            <option value="NORMAL">Normal</option>
            <option value="HIGH">High</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition cursor-pointer"
          >
            <option value="createdAt">Created Time</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>

          <select
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition cursor-pointer"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          {complaints.length > 0 ? (
            complaints.map((c) => (
              <ComplaintCard
                key={c.id}
                complaint={c}
                onClose={handleClose}
                onAssign={handleAssign}
                loadingId={loadingId}
                departments={departments}
              />
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-5xl mb-3">📋</div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">No complaints found</h3>
              <p className="text-sm text-gray-500">Try adjusting your filters.</p>
            </div>
          )}
        </div>

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
              Page <span className="font-semibold">{page + 1}</span> of {totalPages}
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

export default AdminComplaints;