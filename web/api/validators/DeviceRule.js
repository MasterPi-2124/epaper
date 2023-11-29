const { body } = require("express-validator");

const deviceService = require("../services/DeviceService");

const createRule = () => {
  return [
    body("topic")
      .trim()
      .exists({ values: "false" })
      .withMessage("Name is required")
      .custom(async (value) => {
        const devices = await deviceService.getAllDevices({ topic: value });
        if (devices.length > 0) {
          throw new Error("Name is already used");
        }
      })
  ];
};

module.exports = {
  createRule,
};
