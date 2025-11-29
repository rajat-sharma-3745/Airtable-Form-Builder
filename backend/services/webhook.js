import axios from "axios";
import Webhook from "../models/Webhook.js";
import crypto from 'crypto'



export async function createWebhook(userId, accessToken, baseId, tableId) {
   try {
     console.log({userId,baseId,tableId,accessToken})
     const { data } = await axios.post(
         `https://api.airtable.com/v0/bases/${baseId}/webhooks`,
         {
             notificationUrl: process.env.WEBHOOK_RECEIVER_URL,
             specification: {
                 options: {
                     filters: {
                         dataTypes: ["tableData"],
                         recordChangeScope: tableId
                         
                     }
                 }
             }
         },
         {
             headers: {
                 Authorization: `Bearer ${accessToken}`,
                 "Content-Type": "application/json",
             }
         }
     );
 
     const webhook = await Webhook.create({
         userId,
         baseId,
         tableId,
         webhookId: data.id,
         webhookSecret: data.macSecretBase64,
         expirationTime: new Date(data.expirationTime),
     });
 
     return webhook;
   } catch (error) {
      console.log(error?.response)
   }
}


export function verifyWebhook(macSecretBase64, rawBodyString, signatureHeader) {
    if (!macSecretBase64 || !signatureHeader) return false;

    const macSecretDecoded = Buffer.from(macSecretBase64, "base64");

    const body = Buffer.from(rawBodyString, "utf8");

    const hmac = crypto.createHmac("sha256", macSecretDecoded);
    hmac.update(body.toString(), "ascii");

    const expected = "hmac-sha256=" + hmac.digest("hex");

    return crypto.timingSafeEqual(
        Buffer.from(expected),
        Buffer.from(signatureHeader)
    );
}


export async function deleteWebhook(accessToken, webhook) {
    await axios.delete(
        `https://api.airtable.com/v0/bases/${webhook.baseId}/webhooks/${webhook.webhookId}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );

    await Webhook.deleteOne({ _id: webhook._id });
}



