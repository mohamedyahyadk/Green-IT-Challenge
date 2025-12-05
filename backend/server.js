const express = require("express");
const cors = require("cors");
const analyzeRoute = require("./routes/analyzeRoute");
const app = express();

// Middlewares
app.use(cors({ origin: "*", methods: "GET,POST" }));
app.use(express.json({ limit: "5mb" }));

app.use(express.static("backend/public"));
// API routes
app.use("/api", analyzeRoute);

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
