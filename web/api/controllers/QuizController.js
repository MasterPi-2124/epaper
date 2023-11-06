const quizService = require("../services/QuizService");

exports.getAllQuizzes = async (req, res) => {
  //filter
  let filters = {};
  if (req.query._class) {
    filters._class = req.query._class;
  }
  if (req.user.userId) {
    filters.userId = req.user.userId;
  }

  try {
    const quizzes = await quizService.getAllQuizzes(filters);
    res.json({ data: quizzes, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const quiz = await quizService.createQuiz(req.body, req.user.userId);
    res.json({ data: quiz, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await quizService.getQuizById(req.params.id);
    res.json({ data: quiz, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await quizService.updateQuiz(req.params.id, req.body);
    res.json({ data: quiz, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await quizService.deleteQuiz(req.params.id, req.user.userId);
    res.json({ data: quiz, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};