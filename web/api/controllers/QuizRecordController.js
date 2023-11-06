const quizRecordService = require("../services/QuizRecordService");

exports.getAllQuizRecords = async (req, res) => {
  //filter
  let filters = {};
  if (req.query.quiz) {
    filters.quiz = req.query.quiz;
  }
  try {
    const quizRecords = await quizRecordService.getAllQuizRecords(filters);
    res.json({ data: quizRecords, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createQuizRecord = async (req, res) => {
  try {
    const quizRecord = await quizRecordService.createQuizRecord(req.body);
    res.json({ data: quizRecord, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQuizRecordById = async (req, res) => {
  try {
    const quizRecord = await quizRecordService.getQuizRecordById(req.params.id);
    res.json({ data: quizRecord, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateQuizRecord = async (req, res) => {
  try {
    const quizRecord = await quizRecordService.updateQuizRecord(req.params.id, req.body);
    res.json({ data: quizRecord, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteQuizRecord = async (req, res) => {
  try {
    const quizRecord = await quizRecordService.deleteQuizRecord(req.params.id);
    res.json({ data: quizRecord, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQuizRecordByQuizId = async (req, res) => {
  try {
    const quizRecord = await quizRecordService.getQuizRecordByQuizId(req.params.quizId);
    res.json({ data: quizRecord, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addStudent = async (req, res) => {
  try {
    // const quizId = req.body.quiz;
    const quizId = req.params.quizId;
    const studentInput = req.body;
    // console.log(id);
    // console.log(studentInput)
    const quizRecord = await quizRecordService.addStudent(quizId, studentInput);
    res.json({ data: quizRecord, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};