const userService = require("../services/UserService");

exports.getAllUsers = async (req, res) => {
  //filter
  let filters = {};
  if (req.query.groupBy) {
    filters.groupBy = req.query.groupBy;
  }
  if (req.account.accountId) {
    filters.accountId = req.account.accountId;
  }

  try {
    const users = await userService.getAllUsers(filters);
    res.json({ data: users, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body, req.account.accountId);
    res.json({ data: user, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json({ data: user, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.updateUser = async (req, res) => {
  try {
    const user = await classService.updateUser(req.params.id, req.body);
    res.json({ data: user, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await classService.deleteUser(req.params.id, req.account.accountId);
    res.json({ data: user, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};