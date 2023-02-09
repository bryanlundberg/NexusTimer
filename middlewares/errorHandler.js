// Catch 404 and forward to error-handler
function catch404(req, res, next) {
  next(createError(404));
}

// Error-handler
function errorHandler(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
}

module.exports = { catch404, errorHandler }