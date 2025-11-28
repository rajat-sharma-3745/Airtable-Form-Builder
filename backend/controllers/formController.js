import User from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { fetchBases, fetchTables, } from '../services/airtable.js'
import Form from "../models/Form.js";

export const getBases = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req?.user?._id);
  if (!user) return next(new ApiError('User not found', 400))
  if (!user?.accessToken) return next(new ApiError('User not authorized', 401))
  const bases = await fetchBases(user?.accessToken);

  res.json(bases);
})
export const getTables = asyncHandler(async (req, res, next) => {
  const { baseId } = req.params;
  const user = await User.findById(req.user._id);
  const tables = await fetchTables(user?.accessToken, baseId);
  res.json(tables);
})
export const createForm = asyncHandler(async (req, res, next) => {
  const { title, questions, airtableBaseId, airtableTableId } = req.body;

  const form = await Form.create({
    owner: req.user.userId,
    title,
    questions,
    airtableBaseId,
    airtableTableId
  });

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
    .select("title airtableBaseId airtableTableId createdAt")
    .sort({ createdAt: -1 });

  res.json(forms);
})