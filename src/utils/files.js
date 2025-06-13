const fs = require("fs");
const path = require("path");

exports.moveFile = async (filename, newFolderPath, oldFile) => {
  const tempUploadPath = path.join(process.cwd(), "uploads", "temp");
  const folderUploadPath = path.join(process.cwd(), "uploads", newFolderPath);
  const oldPath = path.join(tempUploadPath, filename);
  const newPath = path.join(folderUploadPath, filename);

  if (!fs.existsSync(folderUploadPath)) {
    fs.mkdirSync(folderUploadPath, { recursive: true });
  }

  try {
    await fs.promises.rename(oldPath, newPath);

    // If OldFile Delete
      if (oldFile) {
      const oldFilePath = path.join(folderUploadPath, path.basename(oldFile));

      if (fs.existsSync(oldFilePath)) {
        await fs.promises.unlink(oldFilePath);
      } else {
        console.warn("⚠️ Old File Undefiend:", oldFilePath);
      }
    }
  } catch (error) {
      console.error(error.message);
    throw new Error("خطاء في رفع الصورة");
  }
};

exports.getPathFiles =  (filename, folder) => {
      return path.join("uploads", folder, filename);
}

exports.deleteFiles = async (paths) => {
  const deleteOne = async (filePath) => {
    try {
      await fs.promises.unlink(filePath);
      console.log("🗑️ تم حذف:", filePath);
    } catch (err) {
      if (err.code !== "ENOENT") {
        console.error("❌ خطأ أثناء الحذف:", filePath, err.message);
      } else {
        console.warn("⚠️ الملف غير موجود:", filePath);
      }
    }
  };

  if (!paths) return;

  if (typeof paths === "string") {
    await deleteOne(paths);
  } else if (Array.isArray(paths)) {
    await Promise.all(paths.map(deleteOne));
  }
};


/**
 * Converts all backslashes in a path to forward slashes.
 * 
 * This is useful for ensuring consistent path formatting,
 * especially when working across different operating systems
 * (e.g., Windows uses '\' while URLs and Linux use '/').
 *
 * @param {string} - The original file path.
 * @returns {string} - The normalized path using forward slashes.
 */
exports.normalizePath = (p) => p.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
