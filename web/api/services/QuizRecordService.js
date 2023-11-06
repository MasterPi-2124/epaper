const QuizRecordModel = require("../models/QuizRecord");
const QuizService = require("./QuizService");
const ClassService = require("../services/ClassService");

const defaultNote = {
  existed: "FAIL_EXISTED",
  wrongLocation: "FAIL_DISTANCE",
  expired: "FAIL_EXPIRED",
};

exports.getAllQuizRecords = async (filters = null) => {
  let query = {};
  if (filters) {
    if ("quiz" in filters) {
      query.quiz = filters.quiz;
    }
  }
  return await QuizRecordModel.find(query);
};

exports.getQuizRecordById = async (id) => {
  return await QuizRecordModel.findById(id);
};

exports.createQuizRecord = async (quizRecord) => {
  return await QuizRecordModel.create(quizRecord);
};

exports.updateQuizRecord = async (id, quizRecord) => {
  return await QuizRecordModel.findByIdAndUpdate(id, quizRecord);
};

exports.deleteQuizRecord = async (id) => {
  return await QuizRecordModel.findByIdAndDelete(id);
};

exports.getQuizRecordByQuizId = async (quizId) => {
  let record = await QuizRecordModel.findOne({ quiz: `${quizId}` });
  let recordObj = record ? record.toObject() : null;
  // return await QuizRecordModel.findOne({ quiz: `${quizId}` });
  if (recordObj) {
    recordObj.submissionCount = recordObj.studentList.length;
    let studentCount = 0;
    const quiz = await QuizService.getQuizById(quizId);
    if (quiz) {
      const _class = await ClassService.getClassById(quiz._class);
      if (_class) {
        studentCount = _class.studentCount;
      }
    }
    recordObj.classStudentCount = studentCount;
  }
  return recordObj;
};

// This part was scrapped since front will handle all of these
// const checkRecordValidTime = async (quiz, createAt) => {
//   // const currentTime = new Date().getTime();
//   const quizStartTime = quiz.startTime.getTime();
//   const quizEndTime = quiz.endTime.getTime();
//   let status;
//   if (createAt < quizStartTime) {
//     status = false;
//   } else if (quizEndTime < createAt) {
//     status = false;
//   } else {
//     status = true;
//   }
//   // quiz.status = status;
//   return status;
// };
// const processStudentInput = async (quiz, studentInput) => {
//   let recordNote = studentInput.note;
//   let studentRecord = {
//     studentId: studentInput.studentId,
//     studentName: studentInput.studentName,
//     isValid:  () => {
//       // case 1: already false (wrong location), wrong time   => false
//       // case 2: already false (wrong location), right time   => false
//       // case 3: true (right location), right time            => true
//       // case 4: true (right location), wrong time            => false
//       if (isValid) {
//         if (!checkRecordValidTime(quiz, studentInput.createAt)) {
//           recordNote += " Wrong time";
//           return false;
//         }
//       }
//       return studentInput.isValid;
//     },
//     note: recordNote,
//     createAt: studentInput.createAt,
//   };
//   return studentRecord;
// };

exports.addStudent = async (quizId, studentInput) => {
  // As of issue #53, all student input will be accepted regardless
  // The input will be checked and the result will be showed in isValid and note

  // Prepare
  let record = await this.getQuizRecordByQuizId(quizId);
  let quiz = await QuizService.getQuizById(quizId);
  let studentRecord = {
    studentId: studentInput.studentId ? studentInput.studentId : "",
    studentName: studentInput.studentName ? studentInput.studentName : "",
    ipAddress: studentInput.ipAddress,
    isValid: studentInput.isValid ? studentInput.isValid : true,
    note: studentInput.note ? studentInput.note + " " : "",
  };

  // Checking
  // ...Location - This was the way to check disscussed in the issue
  if (studentRecord.studentId === "" && studentRecord.studentName === "") {
    studentRecord.isValid = false;
    studentRecord.note = defaultNote.wrongLocation;
  }
  // ...Existed
  if (
    record.studentList.some((item) => {
      return (
        item.studentId === studentRecord.studentId ||
        item.ipAddress === studentRecord.ipAddress
      );
    })
  ) {
    studentRecord.isValid = false;
    studentRecord.note = defaultNote.existed;
  }
  // ...Expired
  if (quiz.status === QuizService.quizStatus.finished) {
    studentRecord.isValid = false;
    studentRecord.note = defaultNote.expired;
  }

  // Saving
  record.studentList.push(studentRecord);
  return await this.updateQuizRecord(record._id, record);
};
