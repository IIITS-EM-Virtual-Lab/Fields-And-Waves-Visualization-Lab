// src/pages/Welcome.tsx

import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate("/auth");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center"
      style={{
        background: "linear-gradient(to bottom, #bbdfff, #ffffff)",
      }}
    >
      <img src="/assets/logo.png" alt="Logo" className="w-24 h-24 mb-4" />
      <h1 className="text-3xl font-bold text-red-600 mb-2">
        Welcome to
      </h1>
      <h2 className="text-2xl font-extrabold text-gray-500 mb-1">
        VIRTUAL ELECTROMAGNETICS LABORATORY
      </h2>
      <h3 className="text-xl font-semibold text-red-500 mb-6">
        @ Indian Institute of Information Technology Sri City
      </h3>
      <button
        onClick={handleEnter}
        className="bg-purple-700 hover:bg-purple-800 text-white text-lg px-8 py-2 rounded-full shadow-md transition"
      >
        ENTER
      </button>
    </div>
  );
};

export default Welcome;
