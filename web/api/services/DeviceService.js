const DataModel = require("../models/Data");
const DeviceModel = require("../models/Device");
const mqttClient = require("../mqtt/mqtt");

exports.getAllDevices = async (filters = null) => {
  try {
    // Normal filter
    let query = {};
    if (filters) {
      if ("userID" in filters) {
        query.createdBy = filters.userID;
      }
    }
    const devices = await DeviceModel.find(query);
    const deviceIds = devices.map(device => `${device._id}`);

    await mqttClient.getAllDevicesStatuses(deviceIds);
    console.log("get status done");
    if (filters && "active" in filters) {
        query.active = filters.active === "true" ? true : false;
      }
    return await DeviceModel.find(query);
  } catch (error) {
    console.log(error);
  }
};

exports.getDeviceById = async (id) => {
  return await DeviceModel.findById(id);
}

exports.createDevice = async (device, userID = null) => {
  device.createdBy = userID;
  const deviceCreated = await DeviceModel.create(device);
  mqttClient.subscribe(`${deviceCreated._id}`);
  return deviceCreated;
}

exports.updateDevice = async (id, device) => {
  await mqttClient.updateDevice(id, device);
  if (device.dataID !== "") {
    const data = await DataModel.findById(device.dataID);
    data["deviceName"] = device.name;
    await DataModel.findByIdAndUpdate(device.dataID, data);
  }

  return await DeviceModel.findByIdAndUpdate(id, device);
}

exports.deleteDevice = async (id, userID = null) => {
  let device = await this.getDeviceById(id);
  if (device) {
    if (device.createdBy != userID) {
      return null;
    }
  } else {
    return null;
  }

  if (device.dataID !== "") {
    await mqttClient.updateDevice(device._id, {});
    const data = await DataModel.findById(device.dataID);
    const now = Math.floor(new Date().getTime() / 1000);
    data["deviceID"] = "";
    data["deviceName"] = "";
    data["active"] = false;
    data["activeTimestamp"].push(`${data["activeStartTime"]}-${now}`)
    data["activeStartTime"] = -1;
    await DataModel.findByIdAndUpdate(device.dataID, data);
  }
  
  mqttClient.unsubscribe(`${device._id}`);
  return await DeviceModel.findByIdAndDelete(id);
};

exports.OTA = async (firmware, id, userID = null) => {
  let device = await this.getDeviceById(id);
  if (device) {
    if (device.createdBy != userID) {
      return null;
    }
  } else {
    return null;
  }

  await mqttClient.ota(device._id, firmware);
}