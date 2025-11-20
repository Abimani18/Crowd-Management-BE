const express = require("express");
const Auth = require("../middleware/policeAuthMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const missingController = require("../controller/missingController/missingController");

const missingRouter = express.Router();

// 👨‍👩‍👧 Parent reports missing child (public route)
missingRouter.post("/create",roleMiddleware("Police","Admin"), missingController.createMissingReport);
missingRouter.get("/allMissingChild",roleMiddleware("Police","Admin"),missingController.getAllMissingReports);
missingRouter.get("/singleReport/:id",roleMiddleware("Police","Admin"),missingController.getMissingReportById);
missingRouter.put("/:id",roleMiddleware("Police","Admin"),missingController.updateReportStatus);

module.exports = missingRouter;
