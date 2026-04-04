import { Link } from "react-router-dom";

function Sidebar({ role }) {
  return (
    <div>
      <h3>Sidebar</h3>
      {role === "ADMIN" && (
        <>
          <h4>Dashboard</h4>
          <Link to="/admin/dashboard">Dashboard</Link>
          <br />
          
          <h4>Complaint Management</h4>
          <Link to="/admin/complaints">All Complaints</Link>
          <br />

          <h4>Department Management</h4>
          <Link to="/admin/create-department">Create Department</Link>
          <br />
          <Link to="/admin/departments">View Departments</Link>
        </>
      )}

      {role === "CITIZEN" && (
        <>
          <h4>User Panel</h4>
          <Link to="/user/dashboard">Dashboard</Link>
          <br />
          <Link to="/user/create-complaint">Create Complaint</Link>
          <Link to="/user/my-complaints">My Complaints</Link>
        </>
      )}
      {role === "DEPARTMENT" && (
        <>
          <h4>Department Panel</h4>
          <Link to="/department/dashboard">Dashboard</Link>
          <br />
          <Link to="/department/complaints">Assigned Complaints</Link>
        </>
      )}
    </div>
  );
}

export default Sidebar;
