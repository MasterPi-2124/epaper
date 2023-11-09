const express = require("express");

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/UserController");

const { createRule } = require("../validators/UserRule");
const { validate } = require("../validators/Validator");

const router = express.Router();

router.route("/").get(getAllUsers).post(createRule(), validate, createUser);
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;
