import { useCallback, useReducer } from "react";
import { AdminContext } from "./AdminContext";
import { adminReducer, initialState } from "../reducer/adminReducer";
import { useAuth } from "./useAuth";
import { API_BASE_URL } from "../api"; 

const API = `${API_BASE_URL}/api/admin`;

function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);
  const { user } = useAuth();
  const token = user?.token;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchComplaints = useCallback(
    async ({
      page = 0,
      sortBy = "createdAt",
      sortDir = "desc",
      status = null,
      priority = null,
      deptId = null,
    }) => {
      dispatch({ type: "SET_LOADING" });

      try {
        let url = "";

        if (deptId) {
          url = `${API}/complaints/by-department/${deptId}?page=${page}&size=5&sortBy=${sortBy}&sortDir=${sortDir}`;
        } else {
          url = `${API}/complaints?page=${page}&size=5&sortBy=${sortBy}&sortDir=${sortDir}`;
        }

        if (status && status !== "ALL") {
          url += `&status=${status}`;
        }

        if (priority && priority !== "ALL") {
          url += `&priority=${priority}`;
        }

        const res = await fetch(url, { headers });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Failed");
        }

        const data = await res.json();

        dispatch({
          type: "SET_COMPLAINTS",
          payload: data,
        });
      } catch (err) {
        console.error("Fetch Complaints Error:", err.message);
        dispatch({ type: "SET_ERROR", payload: err.message });
      }
    },
    [token]
  );

  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${API}/departments`, { headers });
      const data = await res.json();

      dispatch({ type: "SET_DEPARTMENTS", payload: data });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/dashboard`, { headers });
      const data = await res.json();

      dispatch({ type: "SET_STATS", payload: data });
    } catch (err) {
      console.error(err);
    }
  };

  const assignComplaint = async (id, deptId) => {
    const res = await fetch(`${API}/assign/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ departmentId: deptId }),
    });

    if (!res.ok) throw new Error("Assign failed");
  };

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