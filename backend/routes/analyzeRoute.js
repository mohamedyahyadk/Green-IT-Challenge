const express = require("express");
const router = express.Router();
const analyzeController = require("../controllers/analyzeController.js");

router.post("/analyze", analyzeController.analyzePage);

module.exports = router;