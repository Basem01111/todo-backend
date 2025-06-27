const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { mbToBytes } = require("../../utils/global");

function createUploader({ folder, fieldName, maxSize = 5, maxCount = 1 }) {
  const uploadPath = path.posix.join(process.cwd(), "uploads", folder);
  const projectUploadsPath = path.posix.join("uploads", folder);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const randomId = crypto.randomUUID();
      const ext = path.posix.extname(file.originalname);
      cb(null, `${timestamp}_${randomId}${ext}`);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: mbToBytes(maxSize) },
  });

  return (req, res, next) => {
    upload.array(fieldName)(req, res, (err) => {
      // Initialize error object
      if (!req.validateErrors) req.validateErrors = {};
      if (!req.validateErrors[fieldName]) req.validateErrors[fieldName] = [];

      // Multer errors
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          req.validateErrors[fieldName].push(
            `الحجم لا يمكن أن يكون أكبر من ${maxSize} ميجابايت`
          );
        } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
          req.validateErrors[fieldName].push(
            `يسمح فقط برفع ${maxCount} ملف${maxCount > 1 ? "ات" : ""}`
          );
        } else {
          req.validateErrors[fieldName].push(err.message);
        }
      }

      if(req.files && req.files[0]) {
        // Get Files
        const files = req.files;
  
        // Manual Size check (even if no multer error)
        for (const file of files) {
          if (file?.size > mbToBytes(maxSize)) {
            req.validateErrors[fieldName].push(
              `الحجم لا يمكن أن يكون أكبر من ${maxSize} ميجابايت`
            );
            break;
          }
        }
  
        if (files.length > maxCount) {
          req.validateErrors[fieldName].push(
            `يسمح فقط برفع ${maxCount} ملف${maxCount > 1 ? "ات" : ""}`
          );
        }
        
        // Add saved paths
        if (files.length > 0) {
          req.filesPaths = files.map((file) =>
            path.posix.join(projectUploadsPath, file.filename)
          );
        }
      }

      if (!req.validateErrors[fieldName].length) req.validateErrors = undefined;

      next();
    });
  };
}

module.exports = createUploader;
