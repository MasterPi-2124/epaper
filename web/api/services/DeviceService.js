const DeviceModel = require("../models/Device");

exports.getAllDevices = async (filters = null) => {
  try {
    // Normal filter
    let query = {};
    if (filters) {
      if ("accountId" in filters) {
        query.createdBy = filters.accountId;
      }
      if ("active" in filters) {
        query.active = filters.active;
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

exports.createDevice = async (device, userId = null ) => {
  device.createdBy = userId;
  return await DeviceModel.create(device);
}

exports.updateDevice = async (id, device) => {
  return await DeviceModel.findByIdAndUpdate(id, device);
}

exports.deleteDevice = async (id, accountId = null) => {
  let device = await this.getDeviceById(id);
  if (device) {
    if (device.createdBy != accountId) {
      return null;
    }
  } else {
    return null;
  }

  return await DeviceModel.findByIdAndDelete(id);
};