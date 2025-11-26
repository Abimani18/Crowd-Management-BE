const express = require("express");
const policeController = require("../controller/policeController/policeController");
const Auth = require("../middleware/userAuthMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validatePolice = require("../middleware/validatePolice");
const upload = require("../middleware/uploadMiddleware");
const policeRouter = express.Router();

// 🔹 Create Police (Admin only)
policeRouter.post(
  "/create",
  roleMiddleware("Admin"),
  upload.single("photo"),
  validatePolice,
  policeController.createPolice
);

// 🔹 Police Login
policeRouter.post("/login", policeController.loginPolice);

// 🔹 Get All Police (Admin only)
policeRouter.get(
  "/allPolice",
  validatePolice,
  roleMiddleware("Police"),
  policeController.getAllPolice
);

// 🔹 Get Police by ID (Admin)
policeRouter.get(
  "/:id",
  validatePolice,
  Auth,
  roleMiddleware("Admin"),
  policeController.getPoliceById
);

// 🔹 Update Police (Admin)
policeRouter.put(
  "/update/:id",
  Auth,
  roleMiddleware("Admin"),
  policeController.updatePolice
);

// 🔹 Update Police Status (Admin)
policeRouter.put(
  "/status/:id",
  Auth,
  roleMiddleware("Admin"),
  policeController.updateStatus
);

// 🔹 Delete Police (Admin)
policeRouter.delete(
  "/delete/:id",
  validatePolice,
  Auth,
  roleMiddleware("Admin"),
  policeController.deletePolice
);

// =====================================
// ✅ NEW: Save Expo Push Token (For Police Devices)
// =====================================
policeRouter.post("/savePushToken", roleMiddleware("Police","Admin"), policeController.savePushToken);


module.exports = policeRouter;
