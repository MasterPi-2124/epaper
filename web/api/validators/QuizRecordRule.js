const { body, param } = require("express-validator");

const quizRecordService = require("../services/QuizRecordService");
const quizService = require("../services/QuizService");
const Quiz = require("../models/Quiz");

const recordRule = () => {
  return [
    // param("quizId").custom(async (quizId, { req }) => {
    //   let quiz = await quizService.getQuizById(quizId);
    //   if (quiz.status == quizService.quizStatus.finished) {
    //     throw new Error(`Quiz ${quizService.quizStatus.finished}`);
    //   } else if (quiz.status == quizService.quizStatus.notStarted) {
    //     throw new Error(`Quiz ${quizService.quizStatus.notStarted}`);
    //   }

    //   let quizRecord = await quizRecordService.getQuizRecordByQuizId(quizId);
    //   if (quizRecord) {
    //     let studentList = quizRecord.studentList;
    //     if (
    //       studentList.some((studentRecord) => {
    //         return (
    //           studentRecord.studentId === req.body.studentId ||
    //           studentRecord.ipAddress === req.body.ipAddress
    //         );
    //       })
    //     ) {
    //       throw new Error("Student ID or IP Address already used");
    //     }
    //   }
    // }),
    // body("studentId")
    //   .trim()
    //   .exists({ value: "falsy" })
    //   .withMessage("Student ID is required")
    //   .isNumeric()
    //   .withMessage("Invalid studentId"),
    param("quizId")
      .trim()
      .exists({ value: "falsy" })
      .withMessage("Quiz Id is required"),
    body("ipAddress")
      .trim()
      .exists({ value: "falsy" })
      .withMessage("IP Address is required"),
    // body("studentName")
    //   .trim()
    //   .exists({ value: "falsy" })
    //   .withMessage("Student Name is required"),
    // body("isValid")
    //   .exists({ value: "falsy" })
    //   .withMessage("IsValid is required")
    //   .isBoolean()
    //   .withMessage("Invalid isValid value"),
    // body("note").optional().isString().withMessage("Invalid note value"),
  ];
};

module.exports = {
  recordRule,
};
