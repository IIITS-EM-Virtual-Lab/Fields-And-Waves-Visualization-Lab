import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentToken } from "../store/slices/authSlice";
import axios from "axios";

const UserDashboard = () => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const [stats, setStats] = useState({ totalPoints: 0, totalQuizzes: 0, accuracy: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quizresult/stats/${user?._id}`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Add authorization header
        'Content-Type': 'application/json'
      }
    });
        setStats(res.data.data.overall);
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };
    if (user?._id) fetchStats();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name} 👋</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded shadow p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Total Points</h2>
            <p className="text-3xl font-bold text-blue-600">{stats.totalPoints}</p>
          </div>
          <div className="bg-white rounded shadow p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Quizzes Completed</h2>
            <p className="text-3xl font-bold text-green-600">{stats.totalQuizzes}</p>
          </div>
          <div className="bg-white rounded shadow p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Accuracy</h2>
            <p className="text-3xl font-bold text-purple-600">{stats.accuracy}%</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
