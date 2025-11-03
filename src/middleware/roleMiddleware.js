// const JWT = require("jsonwebtoken");
// const User = require("../models/user");
// const Config = require("../config/config");

// const roleMiddleware = (allowedRoles = []) => {
//   return async (req, res, next) => {
//     try {
//       const authHeader = req.headers.authorization;
//       if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({ message: "Authorization token missing or invalid" });
//       }

//       const token = authHeader.split(" ")[1];
//       const decoded = JWT.verify(token, Config.SECRET_KEY);

//       const user = await User.findById(decoded.id).populate("roleId");
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       // ✅ Role-based access check
//       if (allowedRoles.length > 0 && !allowedRoles.includes(user.roleId.name)) {
//         return res.status(403).json({
//           message: "Access Denied: You do not have permission to perform this action",
//         });
//       }

//       // ✅ Explicit Admin-only check
//       if (user.roleId.name !== "Admin") {
//         return res.status(403).json({
//           message: "Access Denied: Only Admins can access this resource",
//         });
//       }

//       req.user = user;
//       next();
//     } catch (error) {
//       return res.status(401).json({ message: "Invalid or expired token", error: error.message });
//     }
//   };
// };

// module.exports = roleMiddleware;


const JWT = require("jsonwebtoken");
const User = require("../models/user");
const Police = require("../models/polish");
const Config = require("../config/config");

const roleMiddleware = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      // 🔹 Check token
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token missing or invalid" });
      }

      // 🔹 Decode token
      const token = authHeader.split(" ")[1];
      const decoded = JWT.verify(token, Config.SECRET_KEY);

      // 🔹 Find account (User or Police)
      let account = await User.findById(decoded.id).populate("roleId");
      if (!account) {
        account = await Police.findById(decoded.id).populate("roleId");
      }

      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      const roleName = account.roleId?.name;

      // 🔹 Check role authorization
      if (allowedRoles.length > 0 && !allowedRoles.includes(roleName)) {
        return res.status(403).json({
          message: `Access Denied: ${roleName} is not allowed to perform this action`,
        });
      }

      // Attach user/police info to request
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
