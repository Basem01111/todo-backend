const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

function createUploader({
  types,
  maxSize,
  fieldName,
  maxCount = 1,
  required = false,
  requiredMsg = "هذا الحقل مطلوب",
}) {
  const uploadPath = path.join(process.cwd(), "uploads", "temp");
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const randomId = crypto.randomUUID();
      const ext = path.extname(file.originalname);

      const filename = `${timestamp}_${randomId}${ext}`;
      cb(null, filename);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (types.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("error type"));
    }
  };

  const upload = multer({
    storage,
    limits: { fileSize: maxSize * 1024 * 1024 },
    fileFilter,
  });

  return (req, res, next) => {
    const handleError = (err) => {
      if (!err) return;

      if (!req.validateErrors) req.validateErrors = {};

      // Error Size
      if (err.code === "LIMIT_FILE_SIZE") {
        if (!req.validateErrors[fieldName]) req.validateErrors[fieldName] = [];
        req.validateErrors[fieldName].push(
          `الحجم لا يمكن أن يكون أكبر من ${maxSize} ميجابايت`
        );
      } 
      
      // Error Count
      else if (err.code === "LIMIT_UNEXPECTED_FILE") {
        if (!req.validateErrors[fieldName]) req.validateErrors[fieldName] = [];
        req.validateErrors[fieldName].push(
          `يسمح فقط برفع ${maxCount} ملف${maxCount > 1 ? "ات" : ""}`
        );
      }

      // Error Type
      else if (err.message === "error type") {
        if (!req.validateErrors[fieldName]) req.validateErrors[fieldName] = [];
        req.validateErrors[fieldName].push("نوع الملف غير مسموح به");
      }

      // Other Errors
      else {
        if (!req.validateErrors[fieldName]) req.validateErrors[fieldName] = [];
        req.validateErrors[fieldName].push(err.message);
      }
    };

    const afterUpload = (err) => {
      handleError(err);

      const hasFileError =
        req.validateErrors &&
        req.validateErrors[fieldName] &&
        req.validateErrors[fieldName].length > 0;

      if (required && !hasFileError) {
        const hasFile =
          maxCount > 1 ? req.files && req.files.length > 0 : req.file != null;
        if (!hasFile) {
          if (!req.validateErrors) req.validateErrors = {};
          if (!req.validateErrors[fieldName])
            req.validateErrors[fieldName] = [];
          req.validateErrors[fieldName].push(requiredMsg);
        }
      }

      next();
    };

    if (maxCount > 1) {
      upload.array(fieldName, maxCount)(req, res, afterUpload);
    } else {
      upload.single(fieldName)(req, res, afterUpload);
    }
  };
}

module.exports = createUploader;
