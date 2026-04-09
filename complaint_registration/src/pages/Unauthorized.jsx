import { useNavigate } from "react-router-dom";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-500 mb-8">
          You don't have permission to view this page. Please contact your administrator if you believe this is a mistake.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default Unauthorized;