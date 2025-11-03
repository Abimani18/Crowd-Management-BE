const JWT = require("jsonwebtoken");
const Config = require("../config/config");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // Check for token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization token missing or invalid format" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    const decoded = JWT.verify(token, Config.SECRET_KEY);

    // Find user
    const user = await User.findById(decoded.id).populate("roleId");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user to request
    req.user = user;
    req.role = user.roleId?.name || "Unknown";

    next();
  } catch (error) {
    console.error("User Auth Error:", error);
    res.status(401).json({ message: "Invalid or expired token", error: error.message });
  }
};

module.exports = userAuth;
