const fs = require("fs");
const path = require("path");

exports.moveFile = async (filename, newFolderPath) => {
  const tempUploadPath = path.join(process.cwd(), "uploads", "temp");
  const folderUploadPath = path.join(process.cwd(), "uploads", newFolderPath);
  const oldPath = path.join(tempUploadPath, filename);
  const newPath = path.join(folderUploadPath, filename);

  if (!fs.existsSync(folderUploadPath)) {
    fs.mkdirSync(folderUploadPath, { recursive: true });
  }

  try {
    await fs.promises.rename(oldPath, newPath);
  } catch (error) {
    throw new Error("خطاء في رفع الصورة");
  }
};

exports.getPathFile =  (filename, folder) => {
      return path.join("uploads", folder, filename);
}