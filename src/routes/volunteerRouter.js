const express = require("express");
const volunteerController = require("../controller/volunteerController/volunteerController");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");
const volunteerRouter = express.Router();

// ======================================
// 🔹 Create Volunteer (Admin Only)
// ======================================
volunteerRouter.post(
  "/create",
  roleMiddleware("Admin","Police"),
  upload.single("photo"),
  volunteerController.createVolunteer
);

// ======================================
// 🔹 Volunteer Login
// ======================================
volunteerRouter.post("/login", volunteerController.loginVolunteer);

// ======================================
// 🔹 Get All Volunteers (Admin Only)
// ======================================
volunteerRouter.get(
  "/allVolunteers",
  roleMiddleware("Admin","Police"),
  volunteerController.getAllVolunteers
);

// ======================================
// 🔹 Get Volunteer By ID (Admin Only)
// ======================================
volunteerRouter.get(
  "/:id",
  roleMiddleware("Admin","Police"),
  volunteerController.getVolunteerById
);

// ======================================
// 🔹 Update Volunteer (Admin Only)
// ======================================
volunteerRouter.put(
  "/update/:id",
  roleMiddleware("Admin","Police"),
  volunteerController.updateVolunteer
);

// ======================================
// 🔹 Update Volunteer Status (Admin Only)
// ======================================
volunteerRouter.put(
  "/status/:id",
  roleMiddleware("Admin","Police"),
  volunteerController.updateStatus
);

// ======================================
// 🔹 Delete Volunteer (Admin Only)
// ======================================
volunteerRouter.delete(
  "/delete/:id",
  roleMiddleware("Admin","Police"),
  volunteerController.deleteVolunteer
);

module.exports = volunteerRouter;
