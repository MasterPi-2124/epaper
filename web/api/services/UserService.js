const UserModel = require("../models/User");
const DeviceModel = require("../models/Device");
const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://95.217.121.243:1883", {
  username: "masterpi",
  password: "masterpi"
});

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
    const displayDevice = await DeviceModel.findById(user.deviceID)
    client.on('connect', () => {
      console.log("Connected to MQTT Broker!");
      client.publish(displayDevice.topic, user.fontStyle);
      client.publish(displayDevice.topic, user.designSchema);
      client.publish(displayDevice.topic, user.name);
      client.publish(displayDevice.topic, user.email);
      client.publish(displayDevice.topic, user.address);
      client.publish(displayDevice.topic, user._id);
      client.subscribe(displayDevice.topic, { qos: 0 }, (err) => {
        if (err) {
          console.log(`Error subscribing to topic ${displayDevice.topic}`);
        } else {
          console.log(`Subscribed to topic ${displayDevice.topic} successfully!`);
        }
      });
    })
    
    client.on("message", async (topic, message) => {
      const data = message.toString();
      const regex = /^writeOK\|(.+)$/;
      const match = data.match(regex);
      if (match && topic === displayDevice.topic) {
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