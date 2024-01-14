const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");

const mqttClient = require("./mqtt/mqtt");
const swaggerRouter = require("./resources/swaggerRoutes");
const dataRouter = require("./routes/DataRoutes");
const deviceRouter = require("./routes/DeviceRoutes");
const userRouter = require("./routes/UserRoutes");

mqttClient.connect();

//configure mongoose
require('dotenv').config();
mongoose.set('strictQuery', false);
mongoose.connect(
  process.env.MONGODB_URI,
  {
    tls: true,
    authMechanism: "SCRAM-SHA-256",
    user: process.env.USER,
    pass: process.env.PASS,
    dbName: "epaper",
    tlsCAFile: `/etc/ssl/mongoKey/ca.crt`,
    tlsCertificateKeyFile: `/etc/ssl/mongoKey/backend.pem`
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
app.use("/api/data", dataRouter);
app.use("/api/devices", deviceRouter);
app.use("/api/user", userRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}...`);
  console.log(
    `Docs are available on http://localhost:${process.env.PORT}/api/swagger`
  );
});

module.exports = app;