const express = require("express");
const cors = require("cors");
const analyzeRoute = require("./routes/analyzeRoute");

const app = express();

// Middlewares
app.use(cors({
    origin: "*", // يسمح لأي frontend بالاتصال
    methods: "GET,POST",
}));
app.use(express.json({ limit: "5mb" })); // لمنع JSON errors

// TEST ROUTE
app.get("/", (req, res) => {
    res.send("Backend is working ✅");
});

// API Routes
app.use("/api", analyzeRoute);

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});