const express = require("express");
const multer = require("multer");
const path = require("path");
const Auth = require("../middleware/policeAuthMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const missingController = require("../controller/missingController/missingController");

const missingRouter = express.Router();

// Multer Disk Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});


const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});


// 👨‍👩‍👧 Parent reports missing child (public route)
missingRouter.post("/create",roleMiddleware("Police","Admin"), upload.array("photo", 5), missingController.createMissingReport);
missingRouter.get("/allMissingChild",roleMiddleware("Police","Admin"),missingController.getAllMissingReports);
missingRouter.get("/singleReport/:id",roleMiddleware("Police","Admin"),missingController.getMissingReportById);
missingRouter.put("/:id",roleMiddleware("Police","Admin"),missingController.updateReportStatus);

module.exports = missingRouter;
