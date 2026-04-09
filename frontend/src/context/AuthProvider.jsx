import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { jwtDecode } from "jwt-decode";

export function AuthProvider({ children }) {

  //  INIT STATE DIRECTLY (NO useEffect needed)
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);

      const roles = decoded.roles
        .split(",")
        .map((role) => role.replace("ROLE_", ""));

      return {
        token,
        username: decoded.sub,
        roles,
        exp: decoded.exp,
      };
    } catch {
      localStorage.removeItem("token");
      return null;
    }
  });

  // logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // login
  const login = (token) => {
    localStorage.setItem("token", token);

    const decoded = jwtDecode(token);

    const roles = decoded.roles
      .split(",")
      .map((role) => role.replace("ROLE_", ""));

    const userData = {
      token,
      username: decoded.sub,
      roles,
      exp: decoded.exp,
    };

    setUser(userData);
    return userData;
  };

  //  auto logout on expiry
  useEffect(() => {
    if (!user) return;

    const currentTime = Date.now();
    const expiryTime = user.exp * 1000;
    const timeLeft = expiryTime - currentTime;

    if (timeLeft <= 0) {
      setTimeout(() => {
        alert("Session expired. Please login again.");
        logout();
      }, 0);
      return;
    }

    const timer = setTimeout(() => {
      alert("Session expired. Please login again.");
      logout();
    }, timeLeft);

    return () => clearTimeout(timer);
  }, [user]);
useEffect(() => {
  const handleStorageChange = (event) => {
    if (event.key === "token") {

      // token removed → logout everywhere
      if (!event.newValue) {
        setUser(null);
      }

      // token added/changed → login everywhere
      else {
        try {
          const decoded = jwtDecode(event.newValue);

          const roles = decoded.roles
            .split(",")
            .map((role) => role.replace("ROLE_", ""));

          setUser({
            token: event.newValue,
            username: decoded.sub,
            roles,
            exp: decoded.exp,
          });
        } catch {
          setUser(null);
        }
      }
    }
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}, []);
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}