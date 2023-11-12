const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    name: {
        type: String,
        default: "epd#1"
    },
    userID: {
        type: String,
        unique: false,
        sparse: true
    },
    active: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model("Device", deviceSchema, "device");