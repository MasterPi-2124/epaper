const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    type: {
        type: String,
        default: "Client"
    },
    name: {
        type: String,
        required: true,
        default: "Nguyễn Văn A"
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },

    input2: { 
        // Client:   Address
        // Student:  Student ID
        // Product:  Category
        // Employee: Employee ID
        // Room:     Purpose
        type: String,
    },
    input3: {
        // Student:  Class
        // Product:  Price
        // Employee: Department
        // Room:     Manager
        type: String,
    },
    input4: {
        // Room:     Status
        type: String,
    },

    active: {
        type: Boolean,
        required: true,
    },
    activeStartTime: {
        type: Number,
        default: -1,
    },
    deviceID: {
        type: String,
        default: ""
    },
    activeTimestamp: {
        type: [String],
    },
    fontStyle: {
        type: String,
        default: ""
    },
    designSchema: {
        type: String,
        default: ""
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        default: null
    }
});

module.exports = mongoose.model("User", userSchema, "user");