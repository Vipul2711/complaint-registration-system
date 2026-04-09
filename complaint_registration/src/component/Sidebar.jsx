import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiFileText,
  FiUsers,
  FiPlusCircle,
  FiLayers,
  FiX,
} from "react-icons/fi";

function Sidebar({ role, isOpen, onClose }) {
  const location = useLocation();

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      location.pathname === path
        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col px-4 py-6 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header with close button (mobile only) */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Civic<span className="text-blue-600">Voice</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Portal</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <FiX size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-6">
          {/* ADMIN */}
          {role === "ADMIN" && (
            <>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
                  Dashboard
                </p>
                <Link
                  to="/admin/dashboard"
                  className={linkClass("/admin/dashboard")}
                  onClick={onClose}
                >
                  <FiHome size={18} />
                  Dashboard
                </Link>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
                  Complaints
                </p>
                <Link
                  to="/admin/complaints"
                  className={linkClass("/admin/complaints")}
                  onClick={onClose}
                >
                  <FiFileText size={18} />
                  All Complaints
                </Link>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
                  Departments
                </p>
                <Link
                  to="/admin/create-department"
                  className={linkClass("/admin/create-department")}
                  onClick={onClose}
                >
                  <FiPlusCircle size={18} />
                  Create Department
                </Link>
                <Link
                  to="/admin/departments"
                  className={linkClass("/admin/departments")}
                  onClick={onClose}
                >
                  <FiUsers size={18} />
                  View Departments
                </Link>
              </div>
            </>
          )}

          {/* CITIZEN */}
          {role === "CITIZEN" && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
                Citizen Panel
              </p>
              <Link
                to="/user/dashboard"
                className={linkClass("/user/dashboard")}
                onClick={onClose}
              >
                <FiHome size={18} />
                Dashboard
              </Link>
              <Link
                to="/user/create-complaint"
                className={linkClass("/user/create-complaint")}
                onClick={onClose}
              >
                <FiPlusCircle size={18} />
                File Complaint
              </Link>
              <Link
                to="/user/my-complaints"
                className={linkClass("/user/my-complaints")}
                onClick={onClose}
              >
                <FiLayers size={18} />
                My Complaints
              </Link>
            </div>
          )}

          {/* DEPARTMENT */}
          {role === "DEPARTMENT" && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
                Department Panel
              </p>
              <Link
                to="/department/dashboard"
                className={linkClass("/department/dashboard")}
                onClick={onClose}
              >
                <FiHome size={18} />
                Dashboard
              </Link>
              <Link
                to="/department/complaints"
                className={linkClass("/department/complaints")}
                onClick={onClose}
              >
                <FiFileText size={18} />
                Assigned Complaints
              </Link>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;