import { useReducer } from "react";
import { DepartmentContext } from "./DepartmentContext";
import { departmentReducer, initialState } from "../reducer/departmentReducer";

export const DepartmentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(departmentReducer, initialState);
  const token = localStorage.getItem("token");

  // ✅ PAGINATED FETCH
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
        `http://localhost:8080/api/department/complaints?page=${state.page}&size=5&sortBy=${state.sortBy}&sortDir=${state.sortDir}${statusParam}${priorityParam}`,
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

  // ✅ FULL DATA FETCH
  const fetchAllComplaints = async () => {
    try {
      const firstRes = await fetch(
        "http://localhost:8080/api/department/complaints?page=0&size=50",
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
            `http://localhost:8080/api/department/complaints?page=${i}&size=50`,
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