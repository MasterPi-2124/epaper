const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    },
    name: {
        type: String,
        default: "Nguyễn Văn A"
    },
    gender: {
        type: Number,
        default: 1
    }
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema, "user");
