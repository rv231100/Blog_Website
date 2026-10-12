const errorMiddleware = (err, req, res, next) => {
  console.error(err.message);

  if (res.headersSent) {
    return next(err);
  }

  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: "Image upload failed. Check the file size and type.",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export default errorMiddleware;
