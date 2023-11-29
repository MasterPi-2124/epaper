// Cái này để lấy router (bên dưới)
const express = require("express");

// Đây là 2 hàm của controller
const {
  register,
  login,
  getAccountById,
  updateAccount,
} = require("../controllers/AccountController");

// Đây là quy tắc đã viết ở AccountRule.js
const { registerRule, loginRule } = require("../validators/AccountRule");

// Đây là hàm validate mình đã viết sẵn, bạn không cần để ý nhiều
// Nó là cái để khiến postman hiển thị thông báo từ bộ quy tắc của bạn
const { validate } = require("../validators/Validator");

// router
const router = express.Router();

const auth = require("../auth/auth");

// router.use(registerRule(), validate);
// Khi api là http://localhost:3005/api/accounts/register -> "/register"
// Khi method là POST -> post()
// Lúc này, router sẽ lần lượt gọi từng hàm ở trong post()
// Bộ quy tắc registerRule() -> validate trả kết quả (nếu có lỗi)
// -> Cuối cùng là gọi hàm của controller (register)
// Nếu có lỗi, route sẽ chỉ chạy tới validate và dừng lại, không chạy register
router.route("/register").post(registerRule(), validate, register);
router.route("/login").post(loginRule(), validate, login);
router.route("/:id").get(auth, getAccountById).put(auth, updateAccount);

module.exports = router;
