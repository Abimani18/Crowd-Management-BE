const express = require("express");
const policeController = require("../controller/policeController/policeController");
const Auth = require("../middleware/userAuthMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validatePolice = require("../middleware/validatePolice");
const policeRouter = express.Router();

policeRouter.post("/create",validatePolice,Auth,roleMiddleware("Admin"),policeController.createPolice);
policeRouter.post("/login",policeController.loginPolice);


module.exports = policeRouter;