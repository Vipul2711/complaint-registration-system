import { Outlet } from "react-router-dom";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";
import { useAuth } from "../context/useAuth"

function UserLayout() {
    const {user} = useAuth();
    return (
        <div>
            <Sidebar role ={user?.roles[0]}/>
            <Navbar/>
            <Outlet/>
        </div>
    )
}

export default UserLayout
