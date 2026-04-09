import { useEffect } from "react";
import { FiCheckCircle, FiAlertCircle, FiX } from "react-icons/fi";

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "error" 
    ? "bg-red-50 border-red-200 text-red-800" 
    : "bg-emerald-50 border-emerald-200 text-emerald-800";

  const icon = type === "error" 
    ? <FiAlertCircle className="text-red-600" size={18} /> 
    : <FiCheckCircle className="text-emerald-600" size={18} />;

  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${bgColor} animate-slideIn`}>
      {icon}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-gray-600 transition"
        aria-label="Close"
      >
        <FiX size={16} />
      </button>
    </div>
  );
}

export default Toast;