const UserModel = require("../models/User");
const DeviceModel = require("../models/Device");
const mqttClient = require("../mqtt/mqtt");

exports.findUserByEmail = async (email) => {
  email = email.trim().toLowerCase();
  return await UserModel.findOne({ email: `${email}` });
}

exports.getAllUsers = async (filters = null) => {
  try {
    // Normal filter
    let query = {};
    if (filters) {
      if ("active" in filters) {
        query.active = filters.active;
      }
      if ("accountId" in filters) {
        query.createdBy = filters.accountId;
      }
    }
    return await UserModel.find(query);
  } catch (error) {
    console.log(error);
  }
};

exports.getUserById = async (id) => {
  return await UserModel.findById(id);
}

exports.createUser = async (user, accountId = null) => {
  console.log(user);
  user.createdBy = accountId;
  if (user.active) {
    client = mqttClient.connect();
    const displayDevice = await DeviceModel.findById(user.deviceID)
    client.on('connect', () => {
      console.log("Connected to MQTT Broker!");
      console.log(displayDevice, user);
      client.subscribe(`${displayDevice._id}`, { qos: 2 }, (err) => {
        if (err) {
          console.log(`Error subscribing to topic ${displayDevice._id}: ${err}`);
        } else {
          console.log(`Subscribed to topic ${displayDevice._id} successfully!`);
        }
      });
      let payload = "write1|";
      switch (user.fontStyle) {
        case "Monospace 8pt":
          payload = "F8|" + payload;
          break;
        case "Monospace 12pt":
          payload = "F12|" + payload;
          break;
        case "Monospace 16pt":
          payload = "F16|" + payload;
          break;
        case "Monospace 24pt":
          payload = "F20|" + payload;
          break;
        case "Segoe UI 8pt":
          payload = "F24|" + payload;
          break;
        case "Segoe UI 12pt":
          payload = "S12|" + payload;
          break;
        case "Segoe UI 16pt":
          payload = "S16|" + payload;
          break;
        case "Segoe UI 20pt":
          payload = "S20|" + payload;
          break;
        default:
          payload = "Segoe12|" + payload;
      }

      switch (user.designSchema) {
        case "Theme 1":
          payload = "1|" + payload;
          break;
        case "Theme 2":
          payload = "2|" + payload;
          break;
        case "Theme 3":
          payload = "3|" + payload;
          break;
        case "Theme 4":
          payload = "4|" + payload;
          break;
        default:
          payload = "1|" + payload;
      }

      payload = `${user.name}|` + payload;
      payload = `${user.email}|` + payload;
      payload = `${user.address}|` + payload;
      payload = `${user._id}|` + payload;

      console.log(payload);
      client.publish(`${displayDevice._id}`, payload);
    })

    client.on("message", async (topic, message) => {
      const data = message.toString();
      const regex = /^replyOK\|(.+)$/;
      const match = data.match(regex);
      if (match && topic === displayDevice._id) {
        const oldUserID = match[1];
        const oldUser = await UserModel.findById(oldUserID);
        oldUser["active"] = false;
        oldUser["deviceID"] = "";
        const now = Math.floor(new Date().getTime() / 1000);
        oldUser["activeTimestamp"].push(`${oldUser["activeStartTime"]}-${now}`)
        oldUser["activeStartTime"] = -1;
        await UserModel.findByIdAndUpdate(oldUserID, oldUser);
      }
    })
    await UserModel.create(user);
  } else {
    return await UserModel.create(user);
  }
}

exports.updateUser = async (id, user) => {
  return await UserModel.findByIdAndUpdate(id, user);
}

exports.deleteUser = async (id, accountId = null) => {
  let user = this.getUserById(id, accountId);
  if (user === null) {
    return null;
  }
  return await UserModel.findByIdAndDelete(id);
};