const DataModel = require("../models/Data");
const mqttClient = require("../mqtt/mqtt");

exports.findDataByEmail = async (email) => {
  email = email.trim().toLowerCase();
  return await DataModel.findOne({ email: `${email}` });
}

exports.getAllData = async (filters = null) => {
  try {
    // Normal filter
    let query = {};
    if (filters) {
      if ("active" in filters) {
        query.active = filters.active;
      }
      if ("userID" in filters) {
        query.createdBy = filters.userID;
      }
    }
    return await DataModel.find(query);
  } catch (error) {
    console.log(error);
  }
};

exports.getDataById = async (id) => {
  return await DataModel.findById(id);
}

exports.createData = async (data, userID = null) => {
    data.createdBy = userID;
    console.log(data);

    if (data.active) {
      const createdData = await DataModel.create(data);
      await mqttClient.writeDevice(createdData);
      return await DataModel.findById(createdData._id);
    } else {
      return await DataModel.create(data);
    }
}

exports.updateData = async (id, data) => {
  const oldData = await DataModel.findById(id);
  if (oldData.active) {
    await mqttClient.updateDevice(oldData.deviceID, {});
    if (!data.active) {
      const now = Math.floor(new Date().getTime() / 1000);
      data.activeStartTime = -1;
      data.deviceID = "";
      data.deviceName = "";
      oldData["activeTimestamp"].push(`${oldData["activeStartTime"]}-${now}`)
      data["activeTimestamp"] = oldData["activeTimestamp"];
      return await DataModel.findByIdAndUpdate(id, data);
    }
  }

  if (data.active) {
    await mqttClient.writeDevice(data);
  }
  return await DataModel.findByIdAndUpdate(id, data);
}

exports.deleteData = async (id, userID = null) => {
  let data = await this.getDataById(id, userID);
  if (data === null) {
    return null;
  }
  console.log(data)
  if (data.active) {
    mqttClient.updateDevice(data.deviceID, {});
  }
  return await DataModel.findByIdAndDelete(id);
};