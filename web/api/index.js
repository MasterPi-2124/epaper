const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
require('dotenv').config();

const swaggerRouter = require("./resources/swaggerRoutes");
const userRouter = require("./routes/UserRoutes");

//configure mongoose
mongoose.set('strictQuery', false);
mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
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
app.use("/api/devices", userRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}...`);
  console.log(
    `Docs are available on http://localhost:${process.env.PORT}/api/swagger`
  );
});

module.exports = app;