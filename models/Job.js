const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, "Please provide company name"],
        maxlength: 50
    },
    position: {
        type: String,
        required: [true, "Please provide the position"],
        maxlength: 80
    },
    status: {
        type: String,
        enum: ["Interview", "Declined", "Pending"],
        default: "Pending"
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide user"]
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("Job", JobSchema)