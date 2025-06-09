const cron = require("node-cron");
const fs = require("fs");
const path = require("path");

module.exports = () => {
  cron.schedule("0 2 * * *", async () => {
    try {
      console.log("🚀 Running cron job to delete temp files");
      const tempDir = path.join(process.cwd(), "uploads", "temp");

      if (!fs.existsSync(tempDir)) return;

      const files = fs.readdirSync(tempDir);

      for (const file of files) {
        const filePath = path.join(tempDir, file);

        const stats = fs.statSync(filePath);
        const lastModified = new Date(stats.mtime);
        const now = new Date();

        const hoursDiff = (now - lastModified) / (1000 * 60 * 60);

        if (hoursDiff >= 24) {
          fs.unlinkSync(filePath);
          console.log(`🗑️ Deleted temp file: ${file}`);
        }
      }
    } catch (err) {
      console.error("❌ Error while deleting temp files:", err);
    }
  });
};
