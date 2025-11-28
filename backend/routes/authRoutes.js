import { Router } from "express";
import { callbackController, loginController } from "../controllers/authController.js";


const router = Router();

router.get("/login", loginController);
router.get("/callback", callbackController);


export default router