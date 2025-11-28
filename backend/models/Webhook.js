import mongoose from "mongoose";

const webhookSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    baseId: { type: String, required: true },
    tableId: { type: String, required: true },
    webhookId: { type: String, required: true },
    webhookSecret: { type: String, required: true },
    expirationTime: { type: Date, required: true },

}, { timestamps: true });

webhookSchema.index({ userId: 1, baseId: 1, tableId: 1 }, { unique: true });

export default mongoose.model("Webhook", webhookSchema);