const express = require("express");

const {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
} = require("../controllers/DeviceController");

const auth = require("../auth/auth");
const router = express.Router();

router.use(auth);
router.route("/").get(getAllDevices).post(createDevice);
router.route("/:id").get(getDeviceById).put(updateDevice).delete(deleteDevice);

module.exports = router;
