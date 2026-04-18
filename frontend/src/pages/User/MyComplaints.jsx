import ComplaintCardUser from "../../component/ComplaintCardUser";
import { useUser } from "../../context/UserContext";
import { useAuth } from "../../context/useAuth";
import { useState } from "react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../api";

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
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/citizen/delete_complaint/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      toast.success("Complaint deleted");
      fetchComplaints();
    } catch {
      toast.error("Failed to delete");
    }
    setLoadingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">My Complaints</h1>
            <p className="text-sm text-gray-500 mt-1">
              Total complaints: <span className="font-semibold text-gray-700">{totalElements}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => dispatch({ type: "SET_FILTER", payload: e.target.value })}
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
              value={sortBy}
              onChange={(e) => dispatch({ type: "SET_SORT", payload: { sortBy: e.target.value, sortDir } })}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition cursor-pointer"
            >
              <option value="createdAt">Latest</option>
              <option value="status">Status</option>
            </select>

            <select
              value={sortDir}
              onChange={(e) => dispatch({ type: "SET_SORT", payload: { sortBy, sortDir: e.target.value } })}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition cursor-pointer"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">No complaints found</h3>
              <p className="text-sm text-gray-500">Try adjusting your filters or file a new complaint.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((c) => (
                <div
                  key={c.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition bg-gray-50"
                >
                  <ComplaintCardUser
                    complaint={c}
                    onClose={handleClose}
                    loadingId={loadingId}
                  />
                </div>
              ))}
            </div>
          )}

          {!loading && complaints.length > 0 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => dispatch({ type: "SET_PAGE", payload: page - 1 })}
                disabled={page === 0}
                className="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              <span className="text-sm text-gray-600">
                Page <span className="font-semibold">{page + 1}</span> of {totalPages}
              </span>

              <button
                onClick={() => dispatch({ type: "SET_PAGE", payload: page + 1 })}
                disabled={page + 1 === totalPages}
                className="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyComplaints;