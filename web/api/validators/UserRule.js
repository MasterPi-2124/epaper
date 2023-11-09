const { body } = require("express-validator");

const userService = require("../services/UserService");

const createRule = () => { 
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
        const user = await userService.findUserByEmail(email);
        if (user) {
          throw new Error("Email already in use");
        }
      })
  ];
};

module.exports = {
  createRule,
};
