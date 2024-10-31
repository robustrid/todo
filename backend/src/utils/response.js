exports.successResponse = (data) => ({
  status: 'success',
  data,
});

exports.errorResponse = (message, details = null) => ({
  status: 'error',
  message,
  details,
});
