const deviceService = require("../services/DeviceService");

exports.getAllDevices = async (req, res) => {
  //filter
  let filters = {};
  if (req.query.groupBy) {
    filters.groupBy = req.query.groupBy;
  }

  if (req.query.active) {
    filters.active = req.query.active;
  }

  if (req.user.userID) {
    filters.userID = req.user.userID;
  }

  try {
    const devices = await deviceService.getAllDevices(filters);
    res.json({ data: devices, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.createDevice = async (req, res) => {
  try {
    const device = await deviceService.createDevice(req.body, req.user.userID);
    res.json({ data: device, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDeviceById = async (req, res) => {
  try {
    const device = await deviceService.getDeviceById(req.params.id);
    res.json({ data: device, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.updateDevice = async (req, res) => {
  try {
    const device = await deviceService.updateDevice(req.params.id, req.body);
    res.json({ data: device, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDevice = async (req, res) => {
  try {
    const device = await deviceService.deleteDevice(req.params.id, req.user.userID);
    res.json({ data: device, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};