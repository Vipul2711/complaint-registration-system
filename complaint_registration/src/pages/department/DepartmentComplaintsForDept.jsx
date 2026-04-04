import { useEffect, useState } from "react";
import DepartmentComplaintCard from "../../component/ComplaintCardDepartment";
import { useDepartment } from "../../context/useDepartment";
import Toast from "../../component/Toast";

function DepartmentComplaintsForDept() {
  const { state, dispatch, fetchComplaints } = useDepartment();

  const {
    complaints,
    page,
    totalPages,
    totalElements,
    sortBy,
    sortDir,
    statusFilter,
    priorityFilter,
    loading,
    toast,
  } = state;

  const [loadingId, setLoadingId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchComplaints();
  }, [page, sortBy, sortDir, statusFilter, priorityFilter]);

  // ✅ START WORK
  const handleStart = async (id) => {
    setLoadingId(id);

    try {
      const res = await fetch(
        `http://localhost:8080/api/department/start_work/${id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();

      dispatch({
        type: "SHOW_TOAST",
        payload: { message: "Work started successfully", type: "success" },
      });

      fetchComplaints();
    } catch {
      dispatch({
        type: "SHOW_TOAST",
        payload: { message: "Failed to start work", type: "error" },
      });
    }

    setLoadingId(null);
  };

  // ✅ RESOLVE
  const handleResolve = async (id) => {
    setLoadingId(id);

    try {
      const res = await fetch(
        `http://localhost:8080/api/department/resolve/${id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();

      dispatch({
        type: "SHOW_TOAST",
        payload: { message: "Complaint resolved", type: "success" },
      });

      fetchComplaints();
    } catch {
      dispatch({
        type: "SHOW_TOAST",
        payload: { message: "Failed to resolve complaint", type: "error" },
      });
    }

    setLoadingId(null);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      {/* ✅ TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => dispatch({ type: "HIDE_TOAST" })}
        />
      )}

      <h2>Assigned Complaints ({totalElements})</h2>

      {/* FILTER */}
      <select
        value={statusFilter}
        onChange={(e) =>
          dispatch({
            type: "SET_FILTERS",
            payload: { status: e.target.value, priority: priorityFilter },
          })
        }
      >
        <option value="ALL">All Status</option>
        <option value="ASSIGNED">Assigned</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="RESOLVED">Resolved</option>
      </select>

      {/* SORT */}
      <div style={{ marginBottom: "15px" }}>
        <select
          value={sortBy}
          onChange={(e) =>
            dispatch({
              type: "SET_SORT",
              payload: { sortBy: e.target.value, sortDir },
            })
          }
        >
          <option value="createdAt">Latest</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
        </select>

        <select
          value={sortDir}
          onChange={(e) =>
            dispatch({
              type: "SET_SORT",
              payload: { sortBy, sortDir: e.target.value },
            })
          }
          style={{ marginLeft: "10px" }}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* LIST */}
      {complaints.map((c) => (
        <DepartmentComplaintCard
          key={c.id}
          complaint={c}
          onStart={handleStart}
          onResolve={handleResolve}
          loadingId={loadingId}
        />
      ))}

      {/* PAGINATION */}
      <div>
        <button
          onClick={() => dispatch({ type: "SET_PAGE", payload: page - 1 })}
          disabled={page === 0}
        >
          Prev
        </button>

        <span>
          Page {page + 1} of {totalPages}
        </span>

        <button
          onClick={() => dispatch({ type: "SET_PAGE", payload: page + 1 })}
          disabled={page + 1 === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default DepartmentComplaintsForDept;