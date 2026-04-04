import ComplaintCardUser from "../../component/ComplaintCardUser";
import { useUser } from "../../context/UserContext";
import { useAuth } from "../../context/useAuth";
import { useState } from "react";
import toast from "react-hot-toast";

function MyComplaints() {
  const {
    complaints,
    totalPages,
    totalElements,
    page,
    sortBy,
    sortDir,
    statusFilter,
    dispatch,
    fetchComplaints,
    loading,
  } = useUser();

  const { user } = useAuth();
  const token = user?.token || localStorage.getItem("token");

  const [loadingId, setLoadingId] = useState(null);

  const handleClose = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    setLoadingId(id);

    try {
      const res = await fetch(
        `http://localhost:8080/api/citizen/delete_complaint/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Complaint deleted successfully ✅");

      fetchComplaints();

    } catch {
      toast.error("Failed to delete complaint ❌");
    }

    setLoadingId(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Complaints ({totalElements})</h2>

      {/* FILTER */}
      <select
        value={statusFilter}
        onChange={(e) =>
          dispatch({ type: "SET_FILTER", payload: e.target.value })
        }
      >
        <option value="ALL">All Status</option>
        <option value="SUBMITTED">Submitted</option>
        <option value="ASSIGNED">In Progress</option>
        <option value="RESOLVED">Resolved</option>
        <option value="CLOSED">Closed</option>
      </select>

      {/* SORT */}
      <div>
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
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : complaints.length === 0 ? (
        <p>No complaints found</p>
      ) : (
        complaints.map((c) => (
          <ComplaintCardUser
            key={c.id}
            complaint={c}
            onClose={handleClose}
            loadingId={loadingId}
          />
        ))
      )}

      {/* PAGINATION */}
      <div>
        <button
          onClick={() =>
            dispatch({ type: "SET_PAGE", payload: page - 1 })
          }
          disabled={page === 0}
        >
          Prev
        </button>

        <span>
          {page + 1} / {totalPages}
        </span>

        <button
          onClick={() =>
            dispatch({ type: "SET_PAGE", payload: page + 1 })
          }
          disabled={page + 1 === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default MyComplaints;