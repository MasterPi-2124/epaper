const classService = require("../services/ClassService");

exports.getAllClasses = async (req, res) => {
  //filter
  let filters = {};
  if (req.query.groupBy) {
    filters.groupBy = req.query.groupBy;
  }
  if (req.user.userId) {
    filters.userId = req.user.userId;
  }

  try {
    const _classs = await classService.getAllClasses(filters);
    res.json({ data: _classs, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createClass = async (req, res) => {
  try {
    const _class = await classService.createClass(req.body, req.user.userId);
    res.json({ data: _class, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const _class = await classService.getClassById(req.params.id);
    res.json({ data: _class, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const _class = await classService.updateClass(req.params.id, req.body);
    res.json({ data: _class, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const _class = await classService.deleteClass(req.params.id, req.user.userId);
    res.json({ data: _class, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};