import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;

  if (allowedRoles && !user.roles.some((role) => allowedRoles.includes(role))) {
    return <Navigate to="/unauthorized" />;
  }
  return children;
}

export default ProtectedRoute;
