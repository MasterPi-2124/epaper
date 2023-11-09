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
    active: {
        type: Boolean,
        required: true,
    },
    activeTime: {
        type: [String],
        required: false,

    },
    address: {
        type: String,
        required: true,

    }
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema, "user");