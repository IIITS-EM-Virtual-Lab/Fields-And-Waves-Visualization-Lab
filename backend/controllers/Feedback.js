const Feedback = require("../models/Feedback");

exports.submitFeedback = async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Error submitting feedback." });
  }
};
