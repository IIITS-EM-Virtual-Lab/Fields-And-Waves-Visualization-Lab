import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");

  useEffect(() => {
    if (!token) setStatus("Invalid or missing token.");
  }, [token]);

  useEffect(() => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsValid(false);
    } else if (password !== confirm) {
      setError("Passwords do not match");
      setIsValid(false);
    } else {
      setError("");
      setIsValid(true);
    }
  }, [password, confirm]);

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/password-reset/reset", {
        token,
        newPassword: password,
      });
      alert(res.data.message);
      navigate("/login");
    } catch (err: any) {
      setStatus(err.response?.data?.error || "Reset failed");
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#2ba8e1] to-[#6de6e7] font-sans">
      {/* Left Side */}
      <div className="w-1/2 bg-[#0a2540] text-white px-16 flex flex-col justify-center">
        <h1 className="text-4xl font-semibold mb-4">Reset your password</h1>
        <p className="text-sm leading-relaxed">
          Pick a new password and get right back to learning!
          <br />
          For your security, please choose a password you’ve never used before.
        </p>
      </div>

      {/* Right Side */}
      <div className="w-1/2 bg-white flex items-center justify-center">
        <div className="w-[70%] max-w-md">
          <h2 className="text-lg font-semibold mb-2">Create a new password</h2>
          <p className="text-sm text-gray-600 mb-4">
            Passwords should be at least 8 characters long and should contain a
            mixture of letters, numbers, and other characters.
          </p>

          {status && <p className="text-red-500 text-sm mb-3">{status}</p>}
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <div className="mb-4">
            <label className="text-sm font-medium block mb-1">Create a new password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded"
            />
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium block mb-1">Re-enter password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`w-full py-2 px-4 rounded font-semibold transition ${
              isValid
                ? "bg-[#717171] hover:bg-[#5a5a5a] text-white"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Reset and log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
