const QuizModel = require("../models/Quiz");
const QuizRecord = require("../models/QuizRecord");
const QuizRecordModel = require("../models/QuizRecord");
const QuizRecordService = require("../services/QuizRecordService");

exports.quizStatus = {
  notStarted: "Not Started",
  finished: "Finished",
  inProgress: "In Progress",
};

const addStatusToQuiz = (quiz) => {
  const currentTime = new Date().getTime();
  const quizStartTime = quiz.startTime.getTime();
  const quizEndTime = quiz.endTime.getTime();
  let status = "";
  if (currentTime < quizStartTime) {
    status = this.quizStatus.notStarted;
  } else if (quizEndTime < currentTime) {
    status = this.quizStatus.finished;
  } else {
    status = this.quizStatus.inProgress;
  }
  quiz.status = status;
  return quiz;
};

const removeVersionKey = (document) => {
  return document ? document.toObject({ versionKey: false }) : null;
};

exports.getAllQuizzes = async (filters = null) => {
  let query = {};
  if (filters) {
    if ("_class" in filters) {
      query._class = filters._class;
    }
    if ("userId" in filters) {
      query.createBy = filters.userId;
    }
  }

  const quizzes = await QuizModel.find(query).populate("_class");
  let returnData = [];
  quizzes.map((quiz) => {
    returnData.push(addStatusToQuiz(removeVersionKey(quiz)));
  });
  returnData.sort((a, b) => {
    aStart = a.startTime.getTime();
    bStart = b.startTime.getTime();
    aCreate = a.createdAt.getTime();
    bCreate = b.createdAt.getTime();
    // if (aStart < bStart) {
    //   return -1;
    // } else if (aStart > bStart) {
    //   return 1;
    // } else {
    //   if (aCreate < bCreate) {
    //     return -1;
    //   } else if (aCreate > bCreate) {
    //     return 1; 
    //   } else {
    //     return 0;
    //   }
    // }
    return aStart === bStart ? bCreate - aCreate : bStart - aStart;
  })
  return returnData;
};

exports.getQuizById = async (id) => {
  const quiz = await QuizModel.findById(id).populate("_class");
  return addStatusToQuiz(removeVersionKey(quiz));
};

exports.createQuiz = async (quiz, userId = null) => {
  // When create quiz, a new empty quiz record will be created
  quiz.createBy = userId;
  const newQuiz = await QuizModel.create(quiz);
  const record = new QuizRecordModel({
    quiz: newQuiz._id,
    studentList: [],
  });
  QuizRecordModel.create(record);
  return newQuiz;
};

exports.updateQuiz = async (id, quiz) => {
  return await QuizModel.findByIdAndUpdate(id, quiz);
};

exports.deleteQuiz = async (id, userId = null) => {
  let quiz = this.getQuizById(id, userId);
  if (quiz === null) {
    return null;
  }
  let deleteRecord = await QuizRecordService.getQuizRecordByQuizId(id);
  QuizRecordService.deleteQuizRecord(deleteRecord._id);
  return await QuizModel.findByIdAndDelete(id);
};
