const JWT = require("jsonwebtoken");
const Config = require("../config/config");
const Police = require("../models/polish");

const policeAuth = async (req, res, next) => {
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

    // Find police
    const police = await Police.findById(decoded.id).populate("roleId");
    if (!police) {
      return res.status(404).json({ message: "Police not found" });
    }

    // Attach police to request
    req.police = police;
    req.role = police.roleId?.name || "Unknown";

    next();
  } catch (error) {
    console.error("Police Auth Error:", error);
    res.status(401).json({ message: "Invalid or expired token", error: error.message });
  }
};

module.exports = policeAuth;
