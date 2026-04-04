import { useReducer, useEffect } from "react";
import { UserContext } from "./UserContext";
import { userReducer, initialState } from "../reducer/UserReducer";
import { useAuth } from "./useAuth";
import toast from "react-hot-toast";

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const { user } = useAuth();
  const token = user?.token || localStorage.getItem("token");

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

      if (!res.ok) {
        throw new Error("Failed to fetch complaints");
      }

      const data = await res.json();

      dispatch({ type: "FETCH_SUCCESS", payload: data });

    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: err.message });
      toast.error("Failed to load complaints ❌");
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchComplaints();
  }, [token, state.page, state.sortBy, state.sortDir, state.statusFilter]);

  return (
    <UserContext.Provider value={{ ...state, dispatch, fetchComplaints }}>
      {children}
    </UserContext.Provider>
  );
};