// pages/feedback.tsx
import { useState } from "react";
import axios from "axios";

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    institute: "",
    query: "",
    suggestion: "",
    platformDiscovery: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("https://fields-and-waves-visualization-lab.onrender.com/api/feedback", formData);
      setMessage("Thank you for your feedback!");
      setFormData({
        name: "",
        designation: "",
        institute: "",
        query: "",
        suggestion: "",
        platformDiscovery: "",
      });
    } catch (error) {
      setMessage("Submission failed. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Feedback Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" required placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="designation" required placeholder="Designation" value={formData.designation} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="institute" required placeholder="Institute/Industry/College" value={formData.institute} onChange={handleChange} className="w-full p-2 border rounded" />
        <textarea name="query" required placeholder="Query" value={formData.query} onChange={handleChange} className="w-full p-2 border rounded" />
        <textarea name="suggestion" placeholder="Suggestion (if any)" value={formData.suggestion} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="platformDiscovery" placeholder="How did you find us?" value={formData.platformDiscovery} onChange={handleChange} className="w-full p-2 border rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit Feedback</button>
        {message && <p className="text-center mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default Feedback;
