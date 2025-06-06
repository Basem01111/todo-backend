module.exports = function apiResponse(res, statusCode, message = null, data = null) {
  const success = statusCode >= 400 ? false : true
  res.status(statusCode).json({
    success: success,
    message,
    data: success ? data : null,
    errors: success ? null : data
  });
}