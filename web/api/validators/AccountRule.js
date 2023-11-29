// Đây là một đối tượng trong express-validator
// Nó đại diện cho phần body của 1 request từ front-end
const { body } = require("express-validator");
// https://express-validator.github.io/docs
// https://express-validator.github.io/docs/api/validation-chain

// Cái này cần thì mới gọi
// Đây là service cho đối tượng account
// Mình gọi vì mình muốn kiểm tra xem email đã dùng chưa (bên dưới)
const accountService = require("../services/AccountService");

// Đây là hàm sẽ trả về bộ quy tắc kiểm tra đầu vào 
// Tên đặt tùy ý, miễn là dễ hiểu
const registerRule = () => { 
  return [
    // Lấy dữ liệu của trường "email" trong body 
    // Các hàm sau đó sẽ chạy từ trên xuống / trái sang phải
    body("email") 
      .trim() // Xóa khoảng trắng trước và sau
      .toLowerCase()
      .exists({ values: "false" }) // Kiểm tra null, undefined, ""
      .withMessage("Email is required") // Nếu quy tắc không thỏa mãn, đây sẽ là thông báo trả lại
      .isEmail() // Có phải email không?
      .withMessage("Invalid email")
      // Đây là quy tắc viết riêng trong trường hợp thư viện cho sẵn không có
      // Kiểm tra xem email đã tồn tại chưa
      .custom(async (email) => {
        const account = await accountService.findAccountByEmail(email);
        if (account) {
          throw new Error("Email already in use");
        }
      }),
    body("password")
      .trim()
      .exists({ values: "false" })
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
    body("accountName")
      .trim()
      .exists({ values: "false" })
      .withMessage("Account's name is required")
      .isLength({ min: 1 })
      .withMessage("Account's name must be at least 8 characters long"),
  ];
};

const loginRule = () => {
    return [
        body("email")
      .trim()
      .exists({ values: "false" })
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email"),
    body("password")
      .trim()
      .exists({ values: "false" })
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
    ]
}

module.exports = {
  registerRule,
  loginRule
};
