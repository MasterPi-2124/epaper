const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const quizSchema = require("./Quiz");

const quizRecordSchema = new Schema(
  {
    quiz: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      default: null,
    },
    studentList: [
      {
        studentId: {
          type: String,
          default: "20001234",
        },
        studentName: {
          type: String,
          default: "Nguyễn Văn A",
        },
        ipAddress: {
          type: String,
          default: "2001:0db8:85a3:0000:0000:8a2e:0370:7334"
        },
        isValid: {
          type: Boolean,
          default: true,
        },
        note: {
          type: String,
          default: "",
        },
        // createAt: {
        //   type: Date,
        //   default: Date.now,
        // },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("QuizRecord", quizRecordSchema, "quizRecord");
