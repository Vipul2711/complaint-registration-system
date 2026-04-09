import {  useReducer, useEffect, useState } from "react";
import { userReducer, initialState } from "../reducer/UserReducer";
import { useAuth } from "./useAuth";
import toast from "react-hot-toast";
import { UserContext } from "./UserContext";



export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  });

  const { user } = useAuth();
  const token = user?.token || localStorage.getItem("token");

  // 🔥 FETCH COMPLAINTS (PAGINATED)
  const fetchComplaints = async () => {
    dispatch({ type: "FETCH_START" });

    try {
      let url = `http://localhost:8080/api/citizen/get_my_complaints?page=${state.page}&size=5&sortBy=${state.sortBy}&sortDir=${state.sortDir}`;

      if (state.statusFilter !== "ALL") {
        url += `&status=${state.statusFilter}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch complaints");

      const data = await res.json();

      dispatch({ type: "FETCH_SUCCESS", payload: data });

    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: err.message });
      toast.error("Failed to load complaints ❌");
    }
  };

  // 🔥 FETCH STATS (NEW)
  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/citizen/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch stats");

      const data = await res.json();
      setStats(data);

    } catch (err) {
      console.error("Stats error:", err);
    }
  };

  // 🔁 EFFECT
  useEffect(() => {
    if (!token) return;

    fetchComplaints();
    fetchStats(); // ✅ IMPORTANT

  }, [token, state.page, state.sortBy, state.sortDir, state.statusFilter]);

  return (
    <UserContext.Provider
      value={{
        ...state,
        stats,            // ✅ NEW
        dispatch,
        fetchComplaints,
        fetchStats,       // ✅ NEW
      }}
    >
      {children}
    </UserContext.Provider>
  );
};