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

exports.getPathFile =  (filename, folder) => {
      return path.join("uploads", folder, filename);
}