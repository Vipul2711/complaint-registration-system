import { useEffect } from "react";

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        padding: "12px 20px",
        background: type === "error" ? "#ff4d4f" : "#4caf50",
        color: "white",
        borderRadius: "6px",
        zIndex: 1000,
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      }}
    >
      {message}
    </div>
  );
}

export default Toast;