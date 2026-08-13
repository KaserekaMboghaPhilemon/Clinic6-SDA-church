import express from "express";
import healthRoute from "./routes/health.js";
import config from "./config.js";
import { securityMiddleware } from "./middleware/security.js";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// Security middleware (Helmet, CORS, JSON parsing)
securityMiddleware(app);

// Simple request logging
app.use(logger);

// Routes
app.use("/health", healthRoute);

// Catch-all route for unmatched endpoints
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Centralized error handling middleware (must be registered after all routes)
app.use(errorHandler);

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Clinic 6 SDA backend listening on port ${PORT}`);
});
