import User from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { fetchBases, fetchTableFields, fetchTables, } from '../services/airtable.js'
import Form from "../models/Form.js";
import Webhook from "../models/Webhook.js";
import { createWebhook } from "../services/webhook.js";

export const getBases = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req?.user?._id);
  if (!user) return next(new ApiError('User not found', 400))
  if (!user?.accessToken) return next(new ApiError('User not authorized', 401))
  const bases = await fetchBases(user?._id);

  res.json(bases);
})
export const getTables = asyncHandler(async (req, res, next) => {
  const { baseId } = req.params;
  const user = await User.findById(req.user._id);
  const tables = await fetchTables(user?._id, baseId);
  res.json(tables);
})
export const getTableFields = asyncHandler(async (req, res, next) => {
  const { baseId,tableId } = req.params;
  const user = await User.findById(req.user._id);
   const tableSchema = await fetchTableFields(user?._id, baseId, tableId);
    if (!tableSchema) return next(new ApiError("Table not found",404));

    const supportedTypes = [
      "singleLineText",
      "multiLineText",
      "singleSelect",
      "multipleSelect",
      "multipleAttachments",
    ];

    const fields = tableSchema.fields
      .filter((field) => supportedTypes.includes(field.type))
      .map((field) => ({
        id: field.id,
        name: field.name,
        type: field.type,
        options:
          field.type === "singleSelect" || field.type === "multipleSelect"
            ? field.options?.choices?.map((c) => c.name)
            : [],
      }));

    return res.json(fields);
})
export const createForm = asyncHandler(async (req, res, next) => {
  const { title, questions, baseId, tableId } = req.body;
  
  if(!title || questions.length===0){
     return next(new ApiError('Incomplete information',400));
  }

  const form = await Form.create({
    owner: req.user._id,
    title,
    questions,
    baseId,
    tableId
  });

   const user = await User.findById(req.user._id);
  if (!user?.accessToken) {
    return next(new ApiError("User not authorized", 401));
  }

 
  let existing = await Webhook.findOne({
    userId: req.user._id,
    baseId,
    tableId
  });

 
  if (!existing) {
    const webhook = await createWebhook(
      req.user._id,
      user?.accessToken,
      baseId,
      tableId
    );
    console.log("Webhook created:", webhook.webhookId);
  }

  res.json({ message: "Form created", form });
})
export const getForm = asyncHandler(async (req, res, next) => {
  const form = await Form.findById(req.params.formId);
  if (!form) return next(new ApiError("Form not found", 404));
  res.json(form);
})
export const getUserForms = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const forms = await Form.find({ owner: userId })
    .select("title baseId tableId createdAt")
    .sort({ createdAt: -1 });

  res.json(forms);
})