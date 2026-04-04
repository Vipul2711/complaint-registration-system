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
  const [status, setStatus] = useState("ALL"); // ✅ NEW
  const [toast, setToast] = useState(null);
  const [priority, setPriority] = useState("ALL"); // ✅ NEW
  // ✅ FETCH WITH FILTER
  useEffect(() => {
    fetchComplaints({ page, sortBy, sortDir, status, priority });
    fetchDepartments();
  }, [page, sortBy, sortDir, status, priority]);

  const handleAssign = async (id, deptId) => {
    try {
      await assignComplaint(id, deptId);
      setToast("Assigned Successfully ✅");
      fetchComplaints({ page, sortBy, sortDir, status });
    } catch {
      setToast("Assign failed ❌");
    }
  };

  const handleClose = async (id) => {
    if (!window.confirm("Close this complaint?")) return;

    try {
      await closeComplaint(id);
      setToast("Closed Successfully 🔒");
      fetchComplaints({ page, sortBy, sortDir, status });
    } catch {
      setToast("Error ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Complaints ({totalElements || 0})</h2>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div style={{ marginBottom: "10px" }}>
        {/* ✅ STATUS */}
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(0);
          }}
        >
          <option value="ALL">All Status</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>

        {/* ✅ PRIORITY */}
        <select
          value={priority}
          onChange={(e) => {
            setPriority(e.target.value);
            setPage(0);
          }}
          style={{ marginLeft: "10px" }}
        >
          <option value="ALL">All Priority</option>
          <option value="LOW">Low</option>
          <option value="NORMAL">Normal</option>
          <option value="HIGH">High</option>
        </select>

        {/* SORT */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="createdAt">Created Time</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
        </select>

        <select
          value={sortDir}
          onChange={(e) => setSortDir(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* LIST */}
      {complaints.map((c) => (
        <ComplaintCard
          key={c.id}
          complaint={c}
          type="admin"
          onClose={handleClose}
          onAssign={handleAssign}
          departments={departments}
        />
      ))}

      {/* PAGINATION */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setPage((p) => p - 1)} disabled={page === 0}>
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page + 1} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page + 1 === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AdminComplaints;
