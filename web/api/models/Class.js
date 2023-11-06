const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classSchema = new Schema({
    codename: {
        type: String,
        default: ""
    },
    subject: {
        type: String,
        default: ""
    },
    semester: {
        type: Number,
        default: () => {
            let t = new Date();
            let year = t.getFullYear();
            let month = t.getMonth();
            let sem = "0"
            if (month >= 9 || month <= 2) {
                sem = "1"
            } else if (month >= 3 && month <= 6) {
                sem = "2"
                year -= 1
            } else {
                sem = "3"
                year -= 1
            }
            return Number(year + sem);
        }
    },
    studentCount: {
        type: Number,
        default: 0
    },
    note: {
        type: String,
        default: ""
    },
    createBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Class", classSchema, "class");