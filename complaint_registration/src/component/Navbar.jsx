import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getTitle = () => {
    if (user?.roles[0] === "ADMIN") return "Admin Panel";
    if (user?.roles[0] === "DEPARTMENT") return "Department Panel";
    if (user?.roles[0] === "CITIZEN") return "User Panel";
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <h3>{getTitle()}</h3>

      <div>
        <span>{user?.username}</span>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
