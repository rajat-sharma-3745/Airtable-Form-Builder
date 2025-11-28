import axios from "axios";
import Webhook from "../models/Webhook.js";
import crypto from 'crypto'



export async function createWebhook(userId, accessToken, baseId, tableId) {
    const { data } = await axios.post(
        `https://api.airtable.com/v0/bases/${baseId}/webhooks`,
        {
            notificationUrl: process.env.WEBHOOK_RECEIVER_URL,
            specification: {
                options: {
                    filters: {
                        dataTypes: ["tableData"],
                        tableId,
                        recordChangeScope: "all"
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
}


export function verifyWebhook(secret, req) {
    const signature = req.headers["x-airtable-content-mac"];

    const hash = crypto.createHmac('sha256', Buffer.from(secret, 'base64')).update(req.body).digest('base64')
    return signature === hash;
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



