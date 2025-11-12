const express = require("express");
const Auth = require("../middleware/policeAuthMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const reportController = require("../controller/reportingController/reportingController")

const reportingRouter = express.Router();


// 👮 Police reports found child (protected route)
reportingRouter.get("/allFoundReports",roleMiddleware("Police","Admin"),reportController.getAllFoundReports);
reportingRouter.get("/singleReport/:id",Auth,roleMiddleware("Police"),reportController.getFoundReportById);
reportingRouter.post("/create", Auth, roleMiddleware("Police"), reportController.createFoundReport);
reportingRouter.post("/matchWithMissingReport",Auth, roleMiddleware("Police"),reportController.matchWithMissingReport);
reportingRouter.get("/full-details", Auth, roleMiddleware("Police", "Admin"), reportController.getAllFoundFullDetails);

module.exports = reportingRouter;
