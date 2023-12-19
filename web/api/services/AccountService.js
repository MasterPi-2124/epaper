const AccountModel = require("../models/Account");

exports.secretKey =
  "Dg6ooDLEvh5BJKZNEXI4tByo8DRWNto9bP6tMoWMIqnTJWkSKdccq6M2pqPeqMOHPmHHnQqtWlG77cxyHJ6A3Kt7JfFxGAcjsB1NjaJZukzLhNSnaSTCYtvVyGKwVKUv";

exports.findAccountByEmail = async (email) => {
  email = email.trim().toLowerCase();
  return await AccountModel.findOne({ email: `${email}` });
};

exports.createAccount = async (account) => {
  return await AccountModel.create(account);
}

exports.getAccountById = async (id) => {
  return await AccountModel.findById(id);
}

exports.updateAccount = async (id, account) => {
  let existAccount = await this.getAccountById(id);
  const updatedAccount = {
    ...account,
    email: existAccount.email,
    password: existAccount.password
  }
  return await AccountModel.findByIdAndUpdate(id, updatedAccount);
}