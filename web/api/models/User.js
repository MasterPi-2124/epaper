const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        default: "Nguyễn Văn A"
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    address: {
        type: String,
        required: true,

    },
    active: {
        type: Boolean,
        required: true,
    },
    activeStartTime: {
        type: Number,
        required: false
    },
    activeTimestamp: {
        type: [String],
        required: false,
    }
});

module.exports = mongoose.model("User", userSchema, "user");