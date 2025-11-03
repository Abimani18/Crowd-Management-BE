const express = require("express");
const roleController = require("../controller/role/roleController")
const roleRouter = express.Router();

roleRouter.post("/register",roleController.register);

module.exports = roleRouter;