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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message) setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      await axios.post(
        "https://fields-and-waves-visualization-lab.onrender.com/api/feedback",
        formData,
      );
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm transition placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50";

  const labelClass = "mb-2 block text-sm font-semibold text-gray-700";

  return (
    <main className="bg-white px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-blue-600">
            Feedback
          </p>
          <h1 className="font-serif text-3xl font-medium text-gray-900 sm:text-4xl">
            Help us improve the lab
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            Share your questions, suggestions, or learning experience. Your
            input helps us make the visual lab clearer and more useful.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 rounded-xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] sm:p-8 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-lg bg-gray-50 p-6">
            <h2 className="font-serif text-2xl font-medium text-gray-900">
              Tell us what worked and what did not.
            </h2>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              We review feedback for content clarity, simulations, quizzes, and
              overall learning flow.
            </p>
            <div className="mt-6 h-1 w-16 rounded-full bg-blue-600" />
          </aside>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className={labelClass}>
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="designation" className={labelClass}>
                  Designation
                </label>
                <input
                  id="designation"
                  name="designation"
                  required
                  placeholder="Student, faculty, researcher..."
                  value={formData.designation}
                  onChange={handleChange}
                  className={inputClass}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="institute" className={labelClass}>
                  Institute / Organization
                </label>
                <input
                  id="institute"
                  name="institute"
                  required
                  placeholder="College, industry, or institute"
                  value={formData.institute}
                  onChange={handleChange}
                  className={inputClass}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label htmlFor="query" className={labelClass}>
                Query
              </label>
              <textarea
                id="query"
                name="query"
                required
                placeholder="What would you like to ask or report?"
                value={formData.query}
                onChange={handleChange}
                className={`${inputClass} min-h-28 resize-y`}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="suggestion" className={labelClass}>
                Suggestion
              </label>
              <textarea
                id="suggestion"
                name="suggestion"
                placeholder="Any ideas for improving the lab?"
                value={formData.suggestion}
                onChange={handleChange}
                className={`${inputClass} min-h-24 resize-y`}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="platformDiscovery" className={labelClass}>
                How did you find us?
              </label>
              <input
                id="platformDiscovery"
                name="platformDiscovery"
                placeholder="Search, professor, friend, social media..."
                value={formData.platformDiscovery}
                onChange={handleChange}
                className={inputClass}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </button>
              {message && (
                <p
                  className={`text-sm font-medium ${
                    message.includes("failed") ? "text-red-600" : "text-green-700"
                  }`}
                >
                  {message}
                </p>
              )}
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Feedback;
