// index.js
const dotenv = require("dotenv");
const connectDB = require("./config/db/db");
const app = require("./app");

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB
connectDB();



// Example API route
app.get("/", (req, res) => {
  res.send("🚀 API is running and connected to MongoDB!");
});

// Server start
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
