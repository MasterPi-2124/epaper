const express = require("express");

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/UserController");

const auth = require("../auth/auth");
const { createRule } = require("../validators/UserRule");
const { validate } = require("../validators/Validator");
const router = express.Router();

router.use(auth);
router.route("/").get(getAllUsers).post(createRule(), validate, createUser);
router.route("/:id").get(getUserById).put(createRule(), validate, updateUser).delete(deleteUser);

module.exports = router;
