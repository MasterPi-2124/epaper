const DeviceModel = require("../models/Device");

exports.getAllDevices = async (filters = null) => {
  try {
    // Normal filter
    let query = {};
    if (filters) {
      if ("active" in filters) {
        query.active = filters.active;
      }
      if ("topic" in filters) {
        query.topic = filters.topic;
      }
    }
    return await DeviceModel.find(query);
  } catch (error) {
    console.log(error);
  }
};

exports.getDeviceById = async (id) => {
  return await DeviceModel.findById(id);
}

exports.createDevice = async (device) => {
  return await DeviceModel.create(device);
}

exports.updateDevice = async (id, device) => {
  return await DeviceModel.findByIdAndUpdate(id, device);
}

exports.deleteDevice = async (id) => {
  return await DeviceModel.findByIdAndDelete(id);
};