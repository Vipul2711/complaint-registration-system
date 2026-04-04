import { Outlet } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import { useAuth } from "../context/useAuth";
import Navbar from "../component/Navbar";
function DepartmentLayout() {
  const { user } = useAuth();
  return (
    <div>
      <Sidebar role={user?.roles[0]} />
      <Navbar />
       <Outlet />{" "}
    </div>
  );
}

export default DepartmentLayout;
