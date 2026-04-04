import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Registration() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Send OTP
  const sendOtp = async () => {
    if (loading) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      alert("Enter valid email");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8080/api/auth/send-otp?email=${email}`,
        {
          method: "POST",
        },
      );

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(errorData.message);
      }

      await res.text();

      setStep(2);
      setTimer(0); // reset first
      setTimer(120); // start 2 min timer
      setResendTimer(10);
    } catch (error) {
      console.error(error);
      alert(error.message || "Please wait 10 sec before requesting another OTP ");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Verify OTP + Register
  const verifyOtpAndRegister = async () => {
    if (loading) return;
    if (!username || !password || !otp) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost:8080/api/auth/verify-otp-register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
            otp,
          }),
        },
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText.message);
      }

      await res.json();

      alert("Registered successfully");
      setEmail("");
      setUserName("");
      setPassword("");
      setOtp("");
      setStep(1);
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(error.message || "Invalid OTP or registration failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Timer logic
  useEffect(() => {
  if (resendTimer <= 0) return;

  const interval = setInterval(() => {
    setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
  }, 1000);

  return () => clearInterval(interval);
}, [resendTimer]);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div>
      {/* STEP 1 */}
      {step === 1 && (
        <div>
          <h2>Enter Email</h2>

          <input
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button onClick={sendOtp} disabled={loading}>
            {loading ? "Sending..." : "Get OTP"}
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div>
          <h2>Complete Registration</h2>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />

          <input type="email" value={email} readOnly />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setOtp(value);
              }
            }}
          />

          <button
            onClick={verifyOtpAndRegister}
            disabled={!username || !password || !otp || loading}
          >
           Register
          </button>

          {/* TIMER */}
          <p>
            Time remaining: {Math.floor(timer / 60)}:
            {String(timer % 60).padStart(2, "0")}
          </p>

          {/* RESEND */}
          <button onClick={sendOtp} disabled={timer > 0 || loading}>
            {resendTimer >0 && timer===0 ?`Resend in  ${resendTimer}s` :"Resend OTP"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Registration;
