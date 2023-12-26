const UserModel = require("../models/User");

exports.secretKey =
  "Dg6ooDLEvh5BJKZNEXI4tByo8DRWNto9bP6tMoWMIqnTJWkSKdccq6M2pqPeqMOHPmHHnQqtWlG77cxyHJ6A3Kt7JfFxGAcjsB1NjaJZukzLhNSnaSTCYtvVyGKwVKUv";

exports.findUserByEmail = async (email) => {
  email = email.trim().toLowerCase();
  return await UserModel.findOne({ email: `${email}` });
};

exports.createUser = async (user) => {
  return await UserModel.create(user);
}

exports.getUserById = async (id) => {
  return await UserModel.findById(id);
}

exports.updateUser = async (id, user) => {
  let existUser = await this.getUserById(id);
  const updatedUser = {
    ...user,
    email: existUser.email,
    password: existUser.password
  }
  return await UserModel.findByIdAndUpdate(id, updatedUser);
}