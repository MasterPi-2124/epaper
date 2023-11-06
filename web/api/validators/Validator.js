const { validationResult, body } = require("express-validator");

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  // console.log(errors);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(422).json({
    error: extractedErrors[0],
  });
};

// module.exports = {
//   validate
// };
