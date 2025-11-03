const express = require("express");
const Auth = require("../middleware/policeAuthMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const reportController = require("../controller/reportingController/reportingController")

const reportingRouter = express.Router();


// 👮 Police reports found child (protected route)
reportingRouter.get("/allFoundReports",Auth,roleMiddleware("Police"),reportController.getAllFoundReports);
reportingRouter.get("/singleReport/:id",Auth,roleMiddleware("Police"),reportController.getFoundReportById);
reportingRouter.post("/create", Auth, roleMiddleware("Police"), reportController.createFoundReport);
reportingRouter.post("/matchWithMissingReport",Auth, roleMiddleware("Police"),reportController.matchWithMissingReport);

module.exports = reportingRouter;
