import { useUser } from "../../context/UserContext";

function UserDash() {
  const { complaints, totalElements, loading, error } = useUser();

  // ✅ Calculate stats from CURRENT DATA
  const stats = {
    total: totalElements,
    submitted: complaints.filter(c => c.status === "SUBMITTED").length,
    assigned: complaints.filter(c => c.status === "ASSIGNED").length,
    resolved: complaints.filter(c => c.status === "RESOLVED").length,
    closed: complaints.filter(c => c.status === "CLOSED").length,
  };

  const recentComplaints = complaints.slice(0, 5);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Dashboard</h2>

      {/* 🔥 SUMMARY */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div><h3>Total</h3><p>{stats.total}</p></div>
        <div><h3>Submitted</h3><p>{stats.submitted}</p></div>
        <div><h3>In Progress</h3><p>{stats.assigned}</p></div>
        <div><h3>Resolved</h3><p>{stats.resolved}</p></div>
        <div><h3>Closed</h3><p>{stats.closed}</p></div>
      </div>

      {/* 🔥 RECENT */}
      <h3>Recent Complaints</h3>

      {recentComplaints.length === 0 ? (
        <p>No complaints yet</p>
      ) : (
        recentComplaints.map((c) => (
          <div key={c.id} style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}>
            <p><b>ID:</b> {c.id}</p>
            <p><b>Description:</b> {c.description}</p>
            <p><b>Status:</b> {c.status}</p>
            <p><b>Department:</b> {c.assignedDepartmentName || "Pending Assignment"}</p>
            <p><b>Created:</b> {new Date(c.createdAt).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default UserDash;