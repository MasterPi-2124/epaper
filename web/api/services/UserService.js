const UserModel = require("../models/User");
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
  user.createdBy = accountId;
  console.log(user);
  if (user.active) {
    const createdUser = await UserModel.create(user);
    mqttClient.writeDevice(createdUser);
    return await UserModel.findById(createdUser._id);
  } else {
    return await UserModel.create(user);
  }
}

exports.updateUser = async (id, user) => {
  const oldUser = await UserModel.findById(id);
  if (oldUser.active) {
    mqttClient.updateDevice(oldUser.deviceID, {});
    if (!user.active) {
      const now = Math.floor(new Date().getTime() / 1000);
      user.activeStartTime = -1;
      user["activeTimestamp"].push(`${oldUser["activeStartTime"]}-${now}`)
      return await UserModel.findByIdAndUpdate(id, user);
    }
  }

  if (user.active) {
    mqttClient.writeDevice(user);
  }
  return await UserModel.findByIdAndUpdate(id, user);
}

exports.deleteUser = async (id, accountId = null) => {
  let user = await this.getUserById(id, accountId);
  if (user === null) {
    return null;
  }
  console.log(user)
  if (user.active) {
    mqttClient.updateDevice(user.deviceID, {});
  }
  return await UserModel.findByIdAndDelete(id);
};