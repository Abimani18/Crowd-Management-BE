const express = require("express");
const Auth = require("../middleware/policeAuthMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const missingController = require("../controller/missingController/missingController");

const missingRouter = express.Router();

// 👨‍👩‍👧 Parent reports missing child (public route)
missingRouter.post("/create",Auth,roleMiddleware("Police"), missingController.createMissingReport);
missingRouter.get("/allMissingChild",Auth,roleMiddleware("Police"),missingController.getAllMissingReports);
missingRouter.get("/singleReport/:id",Auth,roleMiddleware("Police"),missingController.getMissingReportById);
missingRouter.put("/:id",Auth,roleMiddleware("Police"),missingController.updateReportStatus);

module.exports = missingRouter;
