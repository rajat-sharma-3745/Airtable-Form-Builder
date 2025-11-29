import Form from "../models/Form.js";
import Response from "../models/Response.js";
import User from "../models/User.js";
import { createRecord } from "../services/airtable.js";
import { shouldShowQuestion } from "../services/conditional.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateField } from "../utils/validator.js";

export const submitForm = asyncHandler(async (req, res, next) => {
    const form = await Form.findById(req.params.formId);
    if (!form) return next(new ApiError("Form not found", 404));
    const {answers} = req.body;


    for (const q of form.questions) {
        const isVisible = shouldShowQuestion(q.conditionalRules, answers);

        if (isVisible) {
            const error = validateField(q, answers[q.questionKey]);
            if (error) {
                return res.status(400).json({ message: error });
            }
        }
    }

    const user = await User.findById(form.owner);
    const airtableFields = {};

    form.questions.forEach(q => {
        airtableFields[q.label] = answers[q.questionKey];
    });

    const record = await createRecord(
        user?._id,
        form.baseId,
        form.tableId,
        airtableFields
    );

  

    const response = await Response.create({
        formId: form._id,
        airtableRecordId: record.id,
        answers
    });

    res.json({ success:true,message: "Response saved", response });

})

export const getResponses = asyncHandler(async (req, res) => {
    const responses = await Response.find({ formId: req.params.formId });
    res.json(responses);
})