const express = require("express");
const Auth = require("../middleware/policeAuthMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const reportController = require("../controller/reportingController/reportingController");
const upload = require("../middleware/uploadMiddleware");

const reportingRouter = express.Router();

reportingRouter.get(
  "/allFoundReports",
  roleMiddleware("Police", "Admin"),
  reportController.getAllFoundReports
);

reportingRouter.get(
  "/singleReport/:id",
  Auth,
  roleMiddleware("Police"),
  reportController.getFoundReportById
);

reportingRouter.get("/full-details", roleMiddleware("Police", "Admin"), reportController.getAllFoundFullDetails);

reportingRouter.post(
  "/matchReport",
  roleMiddleware("Police", "Admin"),
  reportController.parentNameMatchWithMissingReport
);

reportingRouter.post(
  "/create",
  Auth,
  roleMiddleware("Police"),
  upload.single("childPhoto"),
  reportController.createFoundReport
);

reportingRouter.post(
  "/matchWithMissingReport",
  Auth,
  roleMiddleware("Police"),
  reportController.matchWithMissingReport
);

reportingRouter.put(
  "/caseClose/:id",
  roleMiddleware("Police", "Admin"),
  upload.single("reporterImage"),
  reportController.caseClose
);

module.exports = reportingRouter;
