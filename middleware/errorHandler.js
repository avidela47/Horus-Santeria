const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);

  res.json({
    message: err.message,
    stack: process.env.DEV_MODE === "development" ? err.stack : null,
  });
};

export default errorHandler;
