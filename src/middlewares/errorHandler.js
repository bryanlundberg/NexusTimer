// LogError and forward to error-handler
function logError(req, res, next) {
  console.error(err)
  next(err)
}

// Error-handler
function errorHandler(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  })
}

module.exports = { logError, errorHandler }