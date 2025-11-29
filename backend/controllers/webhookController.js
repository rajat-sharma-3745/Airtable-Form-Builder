import axios from "axios";
import Response from "../models/Response.js";
import Webhook from "../models/Webhook.js";
import { verifyWebhook } from "../services/webhook.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.js";

export const webhookHanlder = async (req, res, next) => {
  try {
      console.log('req came')
      res.json(200).end()
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
     const payloads = data.payloads || [];
  
  if (payloads.length === 0) {
    console.log("No payloads");
    return;
  }
  
  
  payloads.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  
  const latest = payloads[payloads.length - 1];
  
  console.log("Processing latest payload:", latest.timestamp);
  
  
  const tables = latest.changedTablesById || {};
  console.log(tables)
  
  for (const tableId of Object.keys(tables)) {
    const tableChanges = tables[tableId];
  
    console.log(tableChanges)
   
    for (const recordId of Object.keys(tableChanges.updatedRecordsById || {})) {
      const rec = tableChanges.updatedRecordsById[recordId];
      console.log("Latest Updated:", recordId);
  
      await Response.findOneAndUpdate(
        { airtableRecordId: recordId },
        { answers: rec.cellValuesByFieldId, updatedAt: new Date() }
      );
    }
  
  
    for (const recordId of tableChanges.destroyedRecordIds || []) {
      console.log(" Latest Deleted:", recordId);
  
      await Response.findOneAndUpdate(
        { airtableRecordId: recordId },
        { deletedInAirtable: true }
      );
    }
  }
  } catch (error) {
    console.log(error)
  }
    
}