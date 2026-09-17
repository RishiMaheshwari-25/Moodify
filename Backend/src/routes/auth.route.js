const express=require("express");
const authRouter=express.Router();
const authController=require("../controller/authController")
const authMiddleware=require("../middleware/auth.middleware")

authRouter.post("/register",authController.registerController);
authRouter.post("/login",authController.loginController);
authRouter.get("/get-me",authMiddleware.identifyUser,authController.getMeController);
authRouter.get("/logout",authController.logoutController)
module.exports=authRouter