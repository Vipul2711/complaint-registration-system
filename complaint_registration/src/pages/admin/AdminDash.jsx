import { useEffect } from "react";
import { useAdmin } from "../../context/useAdmin";

function AdminDash() {
  const { stats, fetchStats } = useAdmin();

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <div>
        <p>Total Complaints: {stats.total}</p>
        <p>Submitted: {stats.submitted}</p>
        <p>Assigned: {stats.assigned}</p>
        <p>In Progress: {stats.inProgress}</p>
        <p>Resolved: {stats.resolved}</p>
        <p>Closed: {stats.closed}</p>
        <p>Departments: {stats.departments}</p>
      </div>
    </div>
  );
}

export default AdminDash;