const fs = require("fs");
const path = require("path");


exports.getPathFiles =  (filename, folder) => {
      return path.posix.join("uploads", folder, filename);
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
