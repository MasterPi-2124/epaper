const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    name: {
        type: String,
        default: "A very beautiful EPD device"
    },
    ssid: {
        type: String,
    },
    pass: {
        type: String,
    },
    dataID: {
        type: String,
        default: ""
    },
    dataName: {
        type: String,
        default: ""
    },
    active: {
        type: Boolean,
        required: true,
        default: false
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
});

module.exports = mongoose.model("Device", deviceSchema, "device");