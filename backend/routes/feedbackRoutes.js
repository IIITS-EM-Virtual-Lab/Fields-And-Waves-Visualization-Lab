const express = require("express");
const router = express.Router();
const { submitFeedback } = require("../controllers/Feedback");

router.post("/", submitFeedback);

module.exports = router;
