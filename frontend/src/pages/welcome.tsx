// src/pages/Welcome.tsx

import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate("/home"); // takes user to public module overview
  };

  const handleLogin = () => {
    navigate("/auth"); // for sign in/sign up
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      style={{
        background: "linear-gradient(to bottom, #bbdfff, #ffffff)",
      }}
    >
      <img src="/assets/logo.png" alt="Logo" className="w-24 h-24 mb-4" />
      
      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-700 mb-2">
        Virtual Electromagnetics Laboratory
      </h2>
      <h3 className="text-lg text-red-500 font-medium mb-4">
        @ Indian Institute of Information Technology Sri City
      </h3>
      
      <p className="max-w-xl text-md sm:text-lg text-gray-600 mb-8 leading-relaxed">
        Learn the fundamentals of electromagnetics through interactive simulations,
        guided modules, and hands-on quizzes designed for college-level learners.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleExplore}
          className="bg-blue-600 hover:bg-blue-700 text-white text-md px-6 py-2 rounded-full shadow-md transition"
        >
          Explore Modules
        </button>
        <button
          onClick={handleLogin}
          className="bg-purple-700 hover:bg-purple-800 text-white text-md px-6 py-2 rounded-full shadow-md transition"
        >
          Login / Sign Up
        </button>
      </div>
    </div>
  );
};

export default Welcome;
