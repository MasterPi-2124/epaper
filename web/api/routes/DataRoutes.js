const express = require("express");

const {
  getAllData,
  getDataById,
  createData,
  updateData,
  deleteData,
} = require("../controllers/DataController");

const auth = require("../auth/auth");
const router = express.Router();

router.use(auth);
router.route("/").get(getAllData).post(createData);
router.route("/:id").get(getDataById).put(updateData).delete(deleteData);

module.exports = router;