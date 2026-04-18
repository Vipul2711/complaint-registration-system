import { useReducer } from "react";
import { DepartmentContext } from "./DepartmentContext";
import { departmentReducer, initialState } from "../reducer/departmentReducer";
import { API_BASE_URL } from "../api"; 

const API = `${API_BASE_URL}/api/department`; 

export const DepartmentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(departmentReducer, initialState);
  const token = localStorage.getItem("token");

  const fetchComplaints = async () => {
    dispatch({ type: "SET_LOADING" });

    try {
      const statusParam =
        state.statusFilter === "ALL" ? "" : `&status=${state.statusFilter}`;

      const priorityParam =
        state.priorityFilter === "ALL"
          ? ""
          : `&priority=${state.priorityFilter}`;

      const res = await fetch(
        `${API}/complaints?page=${state.page}&size=5&sortBy=${state.sortBy}&sortDir=${state.sortDir}${statusParam}${priorityParam}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      dispatch({ type: "SET_DATA", payload: data });
    } catch (err) {
      dispatch({
        type: "SHOW_TOAST",
        payload: { message: "Failed to fetch complaints", type: "error" },
      });
    }
  };

  const fetchAllComplaints = async () => {
    try {
      const firstRes = await fetch(
        `${API}/complaints?page=0&size=50`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const firstData = await firstRes.json();
      let all = [...firstData.content];
      const totalPages = firstData.totalPages;
      
      const promises = [];
      
      for (let i = 1; i < totalPages; i++) {
        promises.push(
          fetch(
            `${API}/complaints?page=${i}&size=50`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ).then((res) => res.json())
        );
      }
      
      const results = await Promise.all(promises);
      
      results.forEach((r) => {
        all = [...all, ...r.content];
      });
      console.log("🔥 First Page:", firstData);
      console.log("🔥 Combined Data:", all);

      dispatch({ type: "SET_ALL_DATA", payload: all });
    } catch (err) {
      dispatch({
        type: "SHOW_TOAST",
        payload: { message: "Failed to fetch dashboard data", type: "error" },
      });
    }
  };

  return (
    <DepartmentContext.Provider
      value={{ state, dispatch, fetchComplaints, fetchAllComplaints }}
    >
      {children}
    </DepartmentContext.Provider>
  );
};