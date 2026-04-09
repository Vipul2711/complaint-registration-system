import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { FiChevronDown, FiLogOut, FiMenu } from "react-icons/fi";

function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const getTitle = () => {
    if (user?.roles[0] === "ADMIN") return "Admin Dashboard";
    if (user?.roles[0] === "DEPARTMENT") return "Department Panel";
    if (user?.roles[0] === "CITIZEN") return "Citizen Panel";
    return "Dashboard";
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = () => {
    if (!user?.username) return "U";
    return user.username.charAt(0).toUpperCase();
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100"
          aria-label="Open menu"
        >
          <FiMenu size={22} className="text-gray-600" />
        </button>
        <h3 className="text-lg md:text-xl font-semibold text-gray-800">
          {getTitle()}
        </h3>
      </div>

      {/* RIGHT */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
        >
          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-sm">
            {getInitials()}
          </div>
          <span className="hidden sm:block text-sm font-medium text-gray-700">
            {user?.username}
          </span>
          <FiChevronDown
            size={16}
            className={`text-gray-500 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-1 animate-fadeIn">
            <button
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FiLogOut size={16} className="text-gray-500" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;