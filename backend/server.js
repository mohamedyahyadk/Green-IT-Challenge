const express = require("express");
const cors = require("cors");
const compression = require("compression");
const analyzeRoute = require("./routes/analyzeRoute");

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== GREEN IT OPTIMIZATIONS ====================
// 1. Compression (reduces data transfer)
app.use(compression({ level: 6 })); // Balanced compression

// 2. CORS with minimal headers
app.use(
  cors({
    origin: "*", // Allow all for contest demo
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    maxAge: 86400, // 24-hour preflight cache
  })
);

// 3. Body parsing with size limit
app.use(express.json({ limit: "50kb" })); // Small payloads only
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// 4. Add performance headers
app.use((req, res, next) => {
  // Cache static responses
  res.set("Cache-Control", "public, max-age=3600"); // 1 hour
  // Security headers
  res.set("X-Content-Type-Options", "nosniff");
  res.set("X-Frame-Options", "DENY");
  // Add green hosting info for judges
  res.set("X-Powered-By", "GreenIT Contest - O2Switch");
  next();
});

// ==================== ROUTES ====================
app.use("/api/analyze", analyzeRoute);

// Health check endpoint (minimal)
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: Date.now(),
    message: "EcoAudit Backend - GreenIT Challenge",
  });
});

// Root endpoint - redirect to frontend or show info
app.get("/", (req, res) => {
  res.json({
    service: "EcoWeb Carbon Calculator API",
    version: "1.0",
    endpoints: ["POST /api/analyze", "GET /health"],
    contest: "N2ITLSE GreenIT Challenge",
    metrics: "Measures: Page weight, DOM count, HTTP requests, CO₂",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    suggestion: 'Use POST /api/analyze with { "url": "https://example.com" }',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(500).json({
    error: "Analysis failed",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌿 EcoAudit backend running on port ${PORT}`);
  console.log(`📊 Performance mode: ${process.env.NODE_ENV || "production"}`);
  console.log(`⚡ Optimized for GreenIT metrics`);
});

module.exports = app; // For testing
