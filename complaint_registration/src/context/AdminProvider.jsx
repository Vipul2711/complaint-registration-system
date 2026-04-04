import { useReducer } from "react";
import { AdminContext } from "./AdminContext";
import { adminReducer, initialState } from "../reducer/adminReducer";
import { useAuth } from "./useAuth";

const API = "http://localhost:8080/api/admin";

function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);
  const { user } = useAuth();
  const token = user?.token;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

 const fetchComplaints = async ({
  page = 0,
  sortBy = "createdAt",
  sortDir = "desc",
  status = "ALL",
  priority = "ALL", // ✅ NEW
}) => {
  dispatch({ type: "SET_LOADING" });

  try {
    let url = `${API}/complaints?page=${page}&size=5&sortBy=${sortBy}&sortDir=${sortDir}`;

    // ✅ STATUS FILTER
    if (status !== "ALL") {
      url += `&status=${status}`;
    }

    // ✅ PRIORITY FILTER
    if (priority !== "ALL") {
      url += `&priority=${priority}`;
    }

    const res = await fetch(url, { headers });

    if (!res.ok) throw new Error("Failed");

    const data = await res.json();

    dispatch({
      type: "SET_COMPLAINTS",
      payload: data,
    });
  } catch (err) {
    dispatch({ type: "SET_ERROR", payload: err.message });
  }
};

  // ✅ FETCH DEPARTMENTS
  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${API}/departments`, { headers });
      const data = await res.json();

      dispatch({ type: "SET_DEPARTMENTS", payload: data });
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ DASHBOARD
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/dashboard`, { headers });
      const data = await res.json();

      dispatch({ type: "SET_STATS", payload: data });
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ ASSIGN
  const assignComplaint = async (id, deptId) => {
    const res = await fetch(`${API}/assign/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ departmentId: deptId }),
    });

    if (!res.ok) throw new Error("Assign failed");
  };

  // ✅ CLOSE
  const closeComplaint = async (id) => {
    const res = await fetch(`${API}/close_complaint/${id}`, {
      method: "PUT",
      headers,
    });

    if (!res.ok) throw new Error("Close failed");
  };

  return (
    <AdminContext.Provider
      value={{
        ...state,
        fetchComplaints,
        fetchDepartments,
        fetchStats,
        assignComplaint,
        closeComplaint,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export default AdminProvider;