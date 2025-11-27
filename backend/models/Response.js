import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
    formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form" },
    airtableRecordId: String,

    answers: mongoose.Schema.Types.Mixed, 

    deletedInAirtable: { type: Boolean, default: false },
}, { timestamps: true })

export default mongoose.model("Response", responseSchema);