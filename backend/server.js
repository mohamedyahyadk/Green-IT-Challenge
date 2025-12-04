const express = require("express");
const cors = require("cors");
const analyzeRoute = require("./routes/analyzeRoute");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api", analyzeRoute);

// server start
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});