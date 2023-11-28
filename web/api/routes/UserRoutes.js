const express = require("express");

const {
  register,
  login,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/UserController");

const { registerRule, loginRule } = require("../validators/UserRule");

const { createRule } = require("../validators/UserRule");
const { validate } = require("../validators/Validator");

const router = express.Router();

router.route("/register").post(registerRule(), validate, register);
router.route("/login").post(loginRule(), validate, login);
router.route("/").get(getAllUsers).post(createRule(), validate, createUser);
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;
