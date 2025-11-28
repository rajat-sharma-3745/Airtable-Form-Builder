import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { createForm, getBases, getForm, getTables } from "../controllers/formController.js";


const router = Router();


router.get("/bases", auth, getBases);
router.get("/:baseId/tables", auth, getTables);

router.post("/", auth, createForm);
router.get("/:formId", getForm)

export default router