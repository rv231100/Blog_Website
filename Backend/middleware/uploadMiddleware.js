import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Invalid file type. Only JPEG, JPG, PNG, GIF, and WEBP are allowed.",
        ),
      );
    }
    cb(null, true);
  },
});
