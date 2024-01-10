const dataService = require("../services/DataService");

exports.getAllData = async (req, res) => {
  //filter
  let filters = {};
  if (req.query.groupBy) {
    filters.groupBy = req.query.groupBy;
  }
  if (req.user.userID) {
    filters.userID = req.user.userID;
  }

  try {
    const dataList = await dataService.getAllData(filters);
    res.json({ data: dataList, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.createData = async (req, res) => {
  try {
    const data = await dataService.createData(req.body, req.user.userID);
    res.json({ data: data, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDataById = async (req, res) => {
  try {
    const data = await dataService.getDataById(req.params.id);
    res.json({ data: data, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.updateData = async (req, res) => {
  try {
    const data = await dataService.updateData(req.params.id, req.body);
    res.json({ data: data, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteData = async (req, res) => {
  try {
    const data = await dataService.deleteData(req.params.id, req.user.userID);
    res.json({ data: data, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};