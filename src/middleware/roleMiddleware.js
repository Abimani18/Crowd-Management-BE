const JWT = require("jsonwebtoken");
const User = require("../models/user");
const Police = require("../models/police");
const Config = require("../config/config");

// ✅ Middleware that allows multiple roles: Admin, Police, etc.
const roleMiddleware = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token missing or invalid" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = JWT.verify(token, Config.SECRET_KEY);

      // 🔹 Try to find in both User and Police collections
      let account = await User.findById(decoded.id).populate("roleId");
      if (!account) {
        account = await Police.findById(decoded.id).populate("roleId");
      }

      if (!account) {
        return res.status(404).json({ message: "User or Police not found" });
      }

      const roleName = account.roleId?.name;

      // ✅ Allow only specified roles (e.g. Admin & Police)
      if (allowedRoles.length > 0 && !allowedRoles.includes(roleName)) {
        return res.status(403).json({
          message: `Access Denied: ${roleName} is not allowed to perform this action`,
        });
      }

      // Attach info for next middleware/controller
      req.user = account;
      req.role = roleName;
      req.userType = account.policeId ? "Police" : "User";

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired token",
        error: error.message,
      });
    }
  };
};

module.exports = roleMiddleware;
