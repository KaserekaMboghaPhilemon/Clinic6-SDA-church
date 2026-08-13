/**
 * API Response Utility
 *
 * Provides consistent response formatting for all API endpoints.
 */

/**
 * Send a successful response
 * @param {Response} res - Express response object
 * @param {number} statusCode - HTTP status code (default 200)
 * @param {any} data - Response data payload
 */
export function sendSuccess(res, statusCode = 200, data = null) {
  return res.status(statusCode).json({
    status: "success",
    data: data,
  });
}

/**
 * Send an error response
 * @param {Response} res - Express response object
 * @param {number} statusCode - HTTP status code (default 500)
 * @param {string} message - Error message for the client
 */
export function sendError(
  res,
  statusCode = 500,
  message = "Internal Server Error",
) {
  return res.status(statusCode).json({
    status: "error",
    data: null,
    error: {
      message: message,
    },
  });
}

/**
 * Send a validation error response
 * @param {Response} res - Express response object
 * @param {string} message - Validation error message
 * @param {object} details - Optional details object
 */
export function sendValidationError(
  res,
  message = "Validation Error",
  details = null,
) {
  const response = {
    status: "error",
    data: null,
    error: {
      message: message,
    },
  };

  if (details) {
    response.error.details = details;
  }

  return res.status(400).json(response);
}
