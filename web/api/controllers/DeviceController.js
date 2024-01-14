const deviceService = require("../services/DeviceService");
const path = require('path');
const fs = require('fs');

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

exports.postOTA = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    console.log('Uploaded File:', req.file.path);
    if (req.query.device) {
      await deviceService.OTA(req.file.path.split('/').pop().split('.').slice(0, -1).join('.'), req.query.device, req.user.userID);
    }
    res.status(200).send('File uploaded successfully.');
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).send('Error during file upload.');
  }
};

exports.getOTA = async (req, res) => {
  // Define the path to the firmware file
  console.log(`Received a OTA request for firmware: ${req.query.version}`);
  res.sendFile(`/root/epaper/web/api/firmwares/${req.query.version}.bin`);

};