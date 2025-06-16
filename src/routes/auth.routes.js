import { Router } from "express";
import { userRegistrationValidator,userLoginValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middlewares.js";
import { getUser, loginUser, logoutUser, registerUser } from "../controllers/auth.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";

const authRoutes= Router()

authRoutes.post("/register",userRegistrationValidator(),validate,registerUser)
authRoutes.post("/login",userLoginValidator(),validate,loginUser)
authRoutes.get("/logout",isLoggedIn,logoutUser)
authRoutes.get("/profile",isLoggedIn,getUser)


export default authRoutes