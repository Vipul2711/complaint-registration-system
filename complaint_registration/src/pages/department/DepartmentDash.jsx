import { useEffect } from "react";
import { useDepartment } from "../../context/useDepartment";
import ComplaintCardDepartment from "../../component/ComplaintCardDepartment";

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
    assigned: allComplaints.filter(c => normalize(c.status) === "ASSIGNED").length,
    inProgress: allComplaints.filter(c => normalize(c.status) === "IN_PROGRESS").length,
    resolved: allComplaints.filter(c => normalize(c.status) === "RESOLVED").length,
    closed: allComplaints.filter(c => normalize(c.status) === "CLOSED").length,
  };

  return (
    <div>
      <h2>Department Dashboard</h2>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <StatCard title="Total" value={stats.total} />
        <StatCard title="Assigned" value={stats.assigned} />
        <StatCard title="In Progress" value={stats.inProgress} />
        <StatCard title="Resolved" value={stats.resolved} />
        <StatCard title="Closed" value={stats.closed} />
      </div>

      <h3>Recent Complaints</h3>

      {allComplaints
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map((c) => (
          <ComplaintCardDepartment key={c.id} complaint={c} />
        ))}
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div style={{
    border: "1px solid #ccc",
    padding: "15px",
    borderRadius: "10px",
    width: "150px",
    textAlign: "center"
  }}>
    <h4>{title}</h4>
    <p>{value}</p>
  </div>
);

export default DepartmentDash;