const UserModel = require("../models/User");

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
    }
    return await UserModel.find(query);
  } catch (error) {
    console.log(error);
  }
};

exports.getUserById = async (id) => {
  return await UserModel.findById(id);
}

exports.createUser = async (user) => {
  return await UserModel.create(user);
}

exports.updateUser = async (id, user) => {
  return await UserModel.findByIdAndUpdate(id, user);
}

exports.deleteUser = async (id) => {
  return await UserModel.findByIdAndDelete(id);
};