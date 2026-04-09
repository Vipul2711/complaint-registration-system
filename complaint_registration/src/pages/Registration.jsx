import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

function Registration() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (loading) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/api/auth/send-otp?email=${email}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(await res.text());
      setStep(2);
      setTimer(120);
      setResendTimer(10);
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please wait and try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpAndRegister = async () => {
    if (loading) return;
    if (!username || !password || !otp) {
      setError("All fields are required.");
      return;
    }
    setError("");
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/auth/verify-otp-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, otp }),
      });
      if (!res.ok) throw new Error(await res.text());
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Invalid OTP or registration failed.");
    } finally {
      setLoading(false);
    }
  };

  // Timers
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((p) => p - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="text-sm text-gray-500 mt-2">
            {step === 1 ? "Step 1: Verify your email" : "Step 2: Complete registration"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>
            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </>
              ) : (
                "Send OTP"
              )}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Choose a username"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) setOtp(val);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="6-digit code"
                maxLength={6}
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                OTP expires in{" "}
                <span className="font-mono font-semibold text-blue-600">
                  {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
                </span>
              </span>
              <button
                onClick={sendOtp}
                disabled={timer > 0 || loading}
                className="text-blue-600 hover:text-blue-800 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {resendTimer > 0 && timer === 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
              </button>
            </div>

            <button
              onClick={verifyOtpAndRegister}
              disabled={!username || !password || !otp || loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Registering...
                </>
              ) : (
                "Complete Registration"
              )}
            </button>
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <NavLink to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Registration;