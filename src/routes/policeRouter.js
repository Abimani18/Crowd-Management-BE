const express = require("express");
const policeController = require("../controller/policeController/policeController");
const Auth = require("../middleware/userAuthMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validatePolice = require("../middleware/validatePolice");
const policeRouter = express.Router();

policeRouter.post("/create",validatePolice,Auth,roleMiddleware("Admin"),policeController.createPolice);
policeRouter.post("/login",policeController.loginPolice);
policeRouter.get("/allPolice",validatePolice,Auth,roleMiddleware("Admin"),policeController.getAllPolice);
policeRouter.get("/:id",validatePolice,Auth,roleMiddleware("Admin"),policeController.getPoliceById);
policeRouter.put("/update/:id",Auth,roleMiddleware("Admin"),policeController.updatePolice);
policeRouter.delete("/delete/:id",validatePolice,Auth,roleMiddleware("Admin"),policeController.deletePolice);


module.exports = policeRouter;