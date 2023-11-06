const express = require("express");
const {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} = require("../controllers/QuizController");
const auth = require("../auth/auth");
const { createRule } = require("../validators/QuizRule");
const { validate } = require("../validators/Validator");

const router = express.Router();

// router.use(auth);
router.route("/").get(auth, getAllQuizzes).post(auth, createRule(), validate, createQuiz);
router.route("/:id").get(getQuizById).delete(auth, deleteQuiz);

module.exports = router;
