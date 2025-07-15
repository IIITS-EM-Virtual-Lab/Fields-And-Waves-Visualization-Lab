import React, { useState } from "react";
import logo from "/logo.png"; // update the path if different

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    setIsValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail));
  };

  const handleReset = () => {
    if (isValidEmail) {
      // trigger backend email logic here
      console.log("Reset link sent to:", email);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white transform -translate-y-12">
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
    </div>
  );
};

export default ForgotPassword;
