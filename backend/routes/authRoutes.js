import { Router } from "express";
import { airtableCallback, airtableLogin } from "../controllers/authController.js";


const router = Router();

router.get("/login", airtableLogin);
router.get("/callback", airtableCallback);


export default router