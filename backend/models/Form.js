import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    questionKey: String,
    fieldId: String,
    label: String,
    type: String,
    required: Boolean,
    options: [String],
    conditionalRules: {
        logic: { type: String, enum: ['AND', 'OR'], default: 'AND' },
        conditions: [
            {
                questionKey: String,
                operator: { type: String, enum: ["equals", "notEquals", "contains"] },
                value: mongoose.Schema.Types.Mixed
            }
        ]
    }
})

const formSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    airtableBaseId: String,
    airtableTableId: String,

    title: String,
    questions: [questionSchema],
}, { timestamps: true })

export default mongoose.model('Form',formSchema);