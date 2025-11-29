import axios from "axios";
import Response from "../models/Response.js";
import Webhook from "../models/Webhook.js";
import { verifyWebhook } from "../services/webhook.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.js";

export const webhookHanlder = asyncHandler(async (req, res, next) => {
    res.status(200).end(); 

      const raw = req.body.toString();
      const body = JSON.parse(raw);

      const webhookId = body?.webhook?.id;
      const baseId = body?.base?.id;

      if (!webhookId || !baseId) {
        console.log("Heartbeat ping");
        return;
      }

      const webhook = await Webhook.findOne({ webhookId });
      if (!webhook) return;
      const user = await User.findById(webhook?.userId)

      const sigHeader = req.headers["x-airtable-content-mac"];
      const isValid = verifyWebhook(
        webhook.webhookSecret,
        raw,
        sigHeader
      );

      if (!isValid) {
        console.log("Invalid signature");
        return;
      }

      const {data} = await axios.get(
        `https://api.airtable.com/v0/bases/${baseId}/webhooks/${webhookId}/payloads`,
        {
          headers: { Authorization: `Bearer ${user?.accessToken}` },
        }
      );

      const {  payloads } = data;

      for (const p of payloads) {
        const {  updated = [], destroyed = [] } = p.records || {};

        for (const rec of updated) {
          await Response.findOneAndUpdate(
            { airtableRecordId: rec.id },
            { answers: rec.fields, updatedAt: new Date() }
          );
        }

        for (const id of destroyed) {
          await Response.findOneAndUpdate(
            { airtableRecordId: id },
            { deletedInAirtable: true }
          );
        }
      }

      
    
})