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
    client = mqttClient.connect();
    mqttClient.writeDevice(client, createdUser);
    return createdUser;
  } else {
    return await UserModel.create(user);
  }
}

exports.updateUser = async (id, user) => {
  const updatedUser = UserModel.findByIdAndUpdate(id, user);
  if (updatedUser.active) {
    client = mqttClient.connect();
    mqttClient.writeDevice(client, updatedUser);
  }
  return await UserModel.findByIdAndUpdate(id, user);
}

exports.deleteUser = async (id, accountId = null) => {
  let user = this.getUserById(id, accountId);
  if (user === null) {
    return null;
  }
  return await UserModel.findByIdAndDelete(id);
};