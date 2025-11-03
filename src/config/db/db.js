// config/db.js
const mongoose = require("mongoose");
const Config = require("../config");

const connectDB = async () => {
  try {
    // Use your local MongoDB URL or environment variable
    const conn = await mongoose.connect(Config.MONGO_URI || "mongodb://127.0.0.1:27017/crowd-app", {
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1); // Stop app if connection fails
  }
};

module.exports = connectDB;
