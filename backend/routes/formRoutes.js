import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { createForm, getBases, getForm, getTableFields, getTables, getUserForms } from "../controllers/formController.js";


const router = Router();


router.get("/bases", auth, getBases);
router.get("/:baseId/tables", auth, getTables);
router.get("/:baseId/tables/:tableId/fields", auth, getTableFields);
router.post("/", auth, createForm);
router.get("/:formId", getForm);
router.get("/user/all", auth, getUserForms);

export default router