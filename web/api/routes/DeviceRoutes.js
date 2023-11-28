const express = require("express");

const {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
} = require("../controllers/DeviceController");

const router = express.Router();
const auth = require("../auth/auth");

router.use(auth);
router.route("/").get(getAllDevices).post(createDevice);
router.route("/:id").get(getDeviceById).put(updateDevice).delete(deleteDevice);

module.exports = router;
