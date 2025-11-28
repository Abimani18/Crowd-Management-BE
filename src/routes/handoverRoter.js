const express = require("express");
const roleMiddleware = require("../middleware/roleMiddleware");
const handOverController = require("../controller/handOverController/handOverController");
const uploadS3 = require("../middleware/s3Upload");

const handoverRouter = express.Router();

handoverRouter.put(
  "/caseClose/:id",
  roleMiddleware("Police", "Admin"),
  uploadS3 .single("reporterImage"),
  handOverController.caseclose
);

module.exports = handoverRouter;
