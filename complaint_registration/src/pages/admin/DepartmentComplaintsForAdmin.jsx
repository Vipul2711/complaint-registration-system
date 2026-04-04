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

  useEffect(() => {
    fetchComplaints({
      page,
      sortBy,
      sortDir,
      deptId: id,
    });
  }, [id, page, sortBy, sortDir]);

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate("/admin/departments")}>
        ← Back
      </button>

      <h2>Complaints - {deptName}</h2>

      {complaints.map((c) => (
        <ComplaintCard key={c.id} complaint={c} type="admin" />
      ))}

      <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</button>
      <button disabled={page + 1 === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
    </div>
  );
}

export default DepartmentComplaintsForAdmin;