// Initializes Express app, global middlewares, and routes
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { globalRateLimiter } = require("./middleware/rateLimit.middleware");
const errorMiddleware = require("./middleware/error.middleware");

const authRoutes = require("./routes/auth.routes");
const tokenRoutes = require("./routes/token.routes");
const userRoutes = require("./routes/user.routes");
const passwordRoutes = require("./routes/password.routes");
const oauthRoutes = require("./routes/oauth.routes");
const app = express();

/* ---------------- GLOBAL MIDDLEWARES ---------------- */

// Global rate limiter (applies to all routes)
app.use(globalRateLimiter);

// Body & cookie parsers
app.use(express.json());
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: "https://clientOrigin.com", // replace with actual frontend origin
    credentials: true,
  })
);

/* ---------------- HEALTH CHECK ---------------- */

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

/* ---------------- ROUTES ---------------- */

app.use("/auth", authRoutes);
app.use("/auth", tokenRoutes);
app.use("/auth", userRoutes);
app.use("/auth", passwordRoutes);
app.use("/auth/oauth", oauthRoutes);

/* ---------------- ERROR HANDLER  ---------------- */

app.use(errorMiddleware);

module.exports = app;
