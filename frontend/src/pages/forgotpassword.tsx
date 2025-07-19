import React, { useState } from "react";
import logo from "/fwvlab.png";
import axios from "axios";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    setIsValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail));
  };

  const handleReset = async () => {
    if (!isValidEmail) return;

    try {
      await axios.post("https://fields-and-waves-visualization-lab.onrender.com/api/password-reset/request", {
        email,
      });
      setEmailSent(true);
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to send reset email");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      {emailSent ? (
        <div className="bg-[#f2f3f5] border border-gray-300 px-8 py-6 rounded-md shadow text-center w-[450px]">
          <img
            src="/fwvlab.png"
            alt="Success"
            className="w-16 h-16 mx-auto mb-4"
          />
          <p className="text-gray-700">
            We’ve sent you a message at:
            <br />
            <span className="font-semibold text-black">{email}</span>
            <br />
            Follow the link in that message to reset your password.
          </p>
        </div>
      ) : (
        <div className="bg-[#f2f3f5] rounded-md shadow border border-gray-200 px-10 py-8 w-[450px]">
          <div className="flex items-center mb-4 space-x-4">
            <img
              src={logo}
              alt="Logo"
              className="w-16 h-16 object-contain rounded"
            />
            <div>
              <label className="block font-semibold text-m mb-1">Email</label>
              <p className="text-m text-gray-600">
                Enter your email to reset your password:
              </p>
            </div>
          </div>

          <input
            type="email"
            value={email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded border border-gray-300 mb-4 text-sm focus:outline-none"
          />

          <button
            onClick={handleReset}
            disabled={!isValidEmail}
            className={`w-full py-2 rounded text-white font-semibold text-sm transition ${
              isValidEmail
                ? "bg-gray-500 hover:bg-gray-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Reset password
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
