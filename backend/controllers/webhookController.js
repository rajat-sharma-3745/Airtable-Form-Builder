import Response from "../models/Response.js";
import Webhook from "../models/Webhook.js";
import { verifyWebhook } from "../services/webhook.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const webhookHanlder = asyncHandler(async (req, res, next) => {
    console.log('Webhook req came')
    // const webhookId = req.headers['x-airtable-webhook-id'];
    
    const body = JSON.parse(req.body.toString());
    console.log(body)
    const webhook = await Webhook.findOne({ webhookId:body?.webhook?.id });
    console.log(req.body.toString(),webhook)

    if (!webhook) return next(new ApiError('Unknown webhook', 400));
    
    
    const isValid = verifyWebhook(webhook.webhookSecret, req);
    console.log(isValid)
    if (!isValid) return next(new ApiError('Invalid signature', 401));
    
    console.log(body.payloads)
    res.json({ ok: true })
    for (const payload of body.payloads) {
        const { updated = [], destroyed = [] } =
            payload.records || {};

        for (const rec of updated) {
            await Response.findOneAndUpdate(
                { airtableRecordId: rec.id },
                {
                    answers: rec.fields,
                    updatedAt: new Date()
                }
            );
        }

        for (const recordId of destroyed) {
            await Response.findOneAndUpdate(
                { airtableRecordId: recordId },
                { deletedInAirtable: true }
            );
        }
    }
    // res.json({ ok: true })
})