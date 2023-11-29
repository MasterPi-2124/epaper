const express = require("express");

const {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
} = require("../controllers/DeviceController");

const { createRule } = require('../validators/DeviceRule');
const { validate } = require('../validators/Validator');
const auth = require("../auth/auth");
const router = express.Router();

router.use(auth);
router.route("/").get(getAllDevices).post(createRule(), validate, createDevice);
router.route("/:id").get(getDeviceById).put(createRule(), validate, updateDevice).delete(deleteDevice);

module.exports = router;
