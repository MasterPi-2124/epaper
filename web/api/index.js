const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");

const mqttClient = require("./mqtt/mqtt");
const swaggerRouter = require("./resources/swaggerRoutes");
const userRouter = require("./routes/UserRoutes");
const deviceRouter = require("./routes/DeviceRoutes");
const accountRouter = require("./routes/AccountRoutes");


mqttClient.connect();

//configure mongoose
require('dotenv').config();
mongoose.set('strictQuery', false);
mongoose.connect(
  process.env.MONGODB_URI,
  {
    ssl: true
  });

//middleware
app.use(express.json());
app.use(cors());
app.use(
  compression({
    level: 9,
    threshold: 10 * 1000,
  })
);
app.use("/api/swagger", swaggerRouter);
app.use("/api/users", userRouter);
app.use("/api/devices", deviceRouter);
app.use("/api/account", accountRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}...`);
  console.log(
    `Docs are available on http://localhost:${process.env.PORT}/api/swagger`
  );
});

module.exports = app;