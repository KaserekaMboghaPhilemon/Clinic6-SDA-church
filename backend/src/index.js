import express from "express";
import healthRoute from "./routes/health.js";
import config from "./config.js";
import { securityMiddleware } from "./middleware/security.js";
import logger from "./middleware/logger.js";

const app = express();

// Security middleware (Helmet, CORS, JSON parsing)
securityMiddleware(app);

// Simple request logging
app.use(logger);

// Routes
app.use("/health", healthRoute);

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Clinic 6 SDA backend listening on port ${PORT}`);
});
