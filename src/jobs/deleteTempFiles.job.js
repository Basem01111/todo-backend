const cron = require("node-cron");
const fs = require("fs");
const path = require("path");

module.exports = () => {
  cron.schedule("*/20 * * * *", async () => {
    try {
      console.log("🧹 Running cron job to clean old temp files...");

      const tempDir = path.join(process.cwd(), "uploads", "temp");

      if (!fs.existsSync(tempDir)) return;

      const files = fs.readdirSync(tempDir);

      for (const file of files) {
        try {
          const filePath = path.join(tempDir, file);

          const timestampPart = file.split("_")[0];
          const timestamp = Number(timestampPart);

          if (isNaN(timestamp)) {
            console.warn(`⛔ Error Name: ${file}`);
            continue;
          }

          const ageInMs = Date.now() - timestamp;
          const ageInMinutes = ageInMs / (1000 * 60);

          if (ageInMinutes > 20) {
            fs.unlinkSync(filePath);
            console.log(`🗑️ Deleted: ${file}`);
          }
        } catch (err) {
          console.error(`❌ Error deleting file ${file}:`, err.message);
        }
      }

    } catch (err) {
      console.error("❌ Cron job error:", err.message);
    }
  });
};
