/**
 * Centralized Error Handling Middleware
 *
 * This middleware catches all errors thrown in route handlers
 * and returns consistent error responses without exposing sensitive information.
 *
 * Must be registered AFTER all routes in Express.
 *
 * @eslint no-undef - process is a Node.js global
 */
/* global process */

import { sendError } from "../utils/apiResponse.js";

/**
 * Express error handling middleware
 * Signature: (err, req, res, next)
 *
 * @param {Error} err - The error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next function (required for error middleware)
 */
// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  // Log the full error server-side for debugging
  console.error(
    `[ERROR] ${new Date().toISOString()} ${req.method} ${req.originalUrl}`,
    {
      message: err.message,
      status: err.status || 500,
      // Note: In production, stack traces should not be logged to client responses
      // but can be logged to server logs for debugging
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    },
  );

  // Determine status code
  let statusCode = err.status || err.statusCode || 500;
  if (statusCode < 400 || statusCode >= 600) {
    statusCode = 500;
  }

  // Prepare safe error message
  let errorMessage = "Internal Server Error";

  if (statusCode === 400) {
    errorMessage = err.message || "Bad Request";
  } else if (statusCode === 401) {
    errorMessage = "Unauthorized";
  } else if (statusCode === 403) {
    errorMessage = "Forbidden";
  } else if (statusCode === 404) {
    errorMessage = "Not Found";
  } else if (statusCode === 422) {
    errorMessage = err.message || "Validation Error";
  } else if (statusCode >= 400 && statusCode < 500) {
    errorMessage = err.message || "Client Error";
  } else if (statusCode >= 500 && statusCode < 600) {
    // 5xx server errors: never expose details to client
    errorMessage = "Internal Server Error";
  }

  // In development, we can expose more error details if needed
  if (process.env.NODE_ENV === "development" && err.message) {
    errorMessage = err.message;
  }

  // Send the error response using the standard format
  sendError(res, statusCode, errorMessage);
}
