import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log(data); // 🔍 debug

      if (!res.ok) {
        throw new Error(data.message || "Login Failed");
      }

      // Handle different possible keys from backend
      const token = data.token || data.jwt || data.accessToken;

      if (!token) {
        throw new Error("Token not received from server");
      }

      // login (decodes + stores user)
      const user = login(token);
      console.log("user after the login :",user);
      //  role-based navigation
      if (user.roles.includes("ADMIN")) {
        navigate("/admin/dashboard");
      } else if (user.roles.includes("DEPARTMENT")) {
        navigate("/department/dashboard");
      } else if(user.roles.includes("CITIZEN")){
        navigate("/user/dashboard");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        type="text"
        placeholder="Enter the username"
        value={username}
        onChange={(e) => setUserName(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter the Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}

export default Login;