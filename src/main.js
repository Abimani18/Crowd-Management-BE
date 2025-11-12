// index.js
const Config = require("./config/config");
const connectDB = require("./config/db/db");
const app = require("./app");


// Connect to MongoDB
connectDB();



// Example API route
app.get("/", (req, res) => {
  res.send("🚀 API is running and connected to MongoDB!");
});

// Server start
const PORT = Config.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
