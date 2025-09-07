const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs"); 
const app = express();

const allowedOrigins = [
  "http://localhost:3000", // local dev
  "https://skin-scan-frontend.onrender.com", // if you deploy frontend separately
  "https://skin-scan-api.onrender.com" // if serving frontend+backend in one container
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Parse JSON
app.use(express.json());

// --- API routes ---
app.use("/api/auth", require("./api/auth"));
app.use("/api/predict", require("./api/predict"));
app.use("/api/history", require("./api/history"));
app.use("/api/feedback", require("./api/feedback"));
app.use("/api/dashboard", require("./api/dashboard"));
app.use("/api/metrics", require("./api/metrics"));

// --- Health check / root ---
app.get("/healthz", (req, res) => res.send("OK"));
app.get("/api", (req, res) => res.send("SkinScan API is running!"));

// --- Serve frontend (Next.js static export) ---
app.use(express.static(path.join(__dirname, "public")));

// Always fallback to index.html for client-side routes
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  }
});

// Fix for SPA routes (e.g. /register, /login, /dashboard on refresh)
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    const filePath = path.join(__dirname, "public", req.path, "index.html");

    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.sendFile(path.join(__dirname, "public", "index.html"));
    }
  }
});

// --- For testing (optional) ---
let server;
if (process.env.NODE_ENV === "test") {
  server = app.listen(0); // ephemeral port
}

const closeServer = () => {
  return new Promise((resolve) => {
    if (server) server.close(resolve);
    else resolve();
  });
};

module.exports = app;
module.exports.closeServer = closeServer;

// --- Start server normally ---
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`SkinScan running on port ${PORT}`);
  });
}
