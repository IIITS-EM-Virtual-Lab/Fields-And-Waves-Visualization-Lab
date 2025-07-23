const express = require("express");
const router = express.Router();
const { submitFeedback } = require("../controllers/Feedback");

router.post("/", submitFeedback);
router.get("/", getAllFeedback);

module.exports = router;
