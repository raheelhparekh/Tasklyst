import { Router } from "express";
import { userRegistrationValidator } from "../validators";
import { validate } from "../middlewares/validator.middlewares";
import { registerUser } from "../controllers/auth.controllers";

const router= Router()

router.post("/register",userRegistrationValidator(),validate,registerUser)


export default router