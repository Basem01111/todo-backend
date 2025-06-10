module.exports = function apiResponse(res, statusCode, message = null, data = null, pagination = null) {
  const success = statusCode < 400;

  const response = {
    success
  };

  if (message !== null) {
    response.message = message;
  }

  if (success && data !== null) {
    response.data = data;
  }

  if (!success && data !== null) {
    response.errors = data;
  }

  if (pagination !== null) {
    response.pagination = pagination;
  }

  res.status(statusCode).json(response);
}
