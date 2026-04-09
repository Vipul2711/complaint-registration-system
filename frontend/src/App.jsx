import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Unauthorized from "./pages/Unauthorized";

import ProtectedRoute from "./component/ProtectedRoute";

import AdminDash from "./pages/admin/AdminDash";
import DepartmentDash from "./pages/department/DepartmentDash";

import UserDash from "./pages/User/UserDash";
import CreateComplaint from "./pages/User/CreateComplaint";
import MyComplaints from "./pages/User/MyComplaints";

import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import DepartmentLayout from "./layouts/DepartmentLayout";

import AdminComplaints from "./pages/admin/AdminComplaints";
import ViewDepartments from "./pages/admin/ViewDepartments";
import CreateDepartment from "./pages/admin/CreateDepartment";
import DepartmentComplaintsForAdmin from "./pages/admin/DepartmentComplaintsForAdmin";
import DepartmentComplaintsForDept from "./pages/department/DepartmentComplaintsForDept";

import { UserProvider } from "./context/UserProvider";
import { DepartmentProvider } from "./context/DepartmentProvider";

import { Toaster } from "react-hot-toast";
import AdminProvider from "./context/AdminProvider";

export default function App() {
  return (
    <>
    
      {/* ✅ CORRECT */}
      <Toaster position="top-right" reverseOrder={false} />

      <BrowserRouter>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ADMIN */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminProvider>
                  <AdminLayout />
                  </AdminProvider>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<AdminDash />} />
              <Route path="complaints" element={<AdminComplaints />} />
              <Route path="departments" element={<ViewDepartments />} />
              <Route
                path="departments/:id"
                element={<DepartmentComplaintsForAdmin />}
              />
              <Route path="create-department" element={<CreateDepartment />} />
            </Route>

          {/* DEPARTMENT */}
          <Route
            path="/department"
            element={
              <ProtectedRoute allowedRoles={["DEPARTMENT"]}>
                <DepartmentProvider>
                  <DepartmentLayout />
                </DepartmentProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<DepartmentDash />} />
            <Route
              path="complaints"
              element={<DepartmentComplaintsForDept />}
            />
          </Route>

          {/* USER */}
          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={["CITIZEN"]}>
                <UserProvider>
                  <UserLayout />
                </UserProvider>
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<UserDash />} />
            <Route path="create-complaint" element={<CreateComplaint />} />
            <Route path="my-complaints" element={<MyComplaints />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
