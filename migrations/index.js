// Imports
const mongoose = require("mongoose");
const connectDB = require("../config/db");

// Migrations Files
const migrateRules = require("./migrateRules"); 
const migrateAdmins = require("./migrateAdmins"); 

(async () => {
  try {
    // Connect Db
    await connectDB();    

    // Satrt Migrations
    await migrateRules()
    await migrateAdmins()
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    // Disconnect Db
    await mongoose.disconnect();
  }
})();
