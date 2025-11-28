import { Router } from "express";
import { getResponses, submitForm } from "../controllers/responseController.js";


const router = Router();

router.post("/:formId/submit", submitForm);
router.get("/:formId/responses", getResponses);


export default router