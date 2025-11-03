const express = require("express");
const userController = require("../controller/userController/userController")
const userRouter = express.Router();

userRouter.post("/register",userController.register);
userRouter.post("/login",userController.login);


module.exports = userRouter;