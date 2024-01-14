const express = require("express");
const multer = require('multer');
const auth = require("../auth/auth");
const fs = require('fs');

if (!fs.existsSync("firmwares")){
  fs.mkdirSync("firmwares");
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'firmwares/'); // Set the destination for file uploads
  },
  filename: function(req, file, cb) {
      cb(null, file.originalname); // Use the original file name
  }
});

const upload = multer({ storage: storage });

const {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  getOTA,
  postOTA
} = require("../controllers/DeviceController");

const router = express.Router();

router.route("/upgrade").get(getOTA);

router.use(auth);
router.route("/").get(getAllDevices).post(createDevice);
router.route("/:id").get(getDeviceById).put(updateDevice).delete(deleteDevice);
router.route("/upgrade").post(upload.single('firmware'), postOTA);

module.exports = router;
