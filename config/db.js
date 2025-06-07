// Database connection
const mongoose = require("mongoose");
require("dotenv").config();

module.exports = async function connectDB() {
  try {
    await mongoose
      .connect(process.env.DATABASE_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    return console.log("✅ Connected to MongoDB...");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
};
