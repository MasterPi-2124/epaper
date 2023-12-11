const UserModel = require("../models/User");
const DeviceModel = require("../models/Device");
const mqttClient = require("../mqtt/mqtt");

exports.getAllDevices = async (filters = null) => {
  try {
    // Normal filter
    let query = {};
    if (filters) {
      if ("accountId" in filters) {
        query.createdBy = filters.accountId;
      }
    }
    const devices = await DeviceModel.find(query);
    const deviceIds = devices.map(device => `${device._id}`);

    await mqttClient.getAllDevicesStatuses(deviceIds)
    console.log("get status done")
    if (filters) {
      if ("active" in filters) {
        query.active = filters.active === "true" ? true : false;
      }
    }
    console.log(query)
    console.log("old devices: ", devices)
    return await DeviceModel.find(query);
  } catch (error) {
    console.log(error);
  }
};

exports.getDeviceById = async (id) => {
  return await DeviceModel.findById(id);
}

exports.createDevice = async (device, userId = null) => {
  device.createdBy = userId;
  const deviceCreated = await DeviceModel.create(device);
  mqttClient.subscribe(`${deviceCreated._id}`);
  return deviceCreated;
}

exports.updateDevice = async (id, device) => {
  mqttClient.updateDevice(id, device);
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
  
  mqttClient.unsubscribe(device._id);
  if (device.userID !== "") {
    const user = await UserModel.findById(device.userID);
    const now = Math.floor(new Date().getTime() / 1000);
    user["deviceID"] = "";
    user["active"] = false;
    user["activeTimestamp"].push(`${user["activeStartTime"]}-${now}`)
    user["activeStartTime"] = -1;
    await UserModel.findByIdAndUpdate(device.userID, user);
  }

  return await DeviceModel.findByIdAndDelete(id);
};