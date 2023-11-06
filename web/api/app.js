const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");

const swaggerRouter = require("./resources/swaggerRoutes");
const quizRouter = require("./routes/QuizRoutes");
const classRouter = require("./routes/ClassRoutes");
const quizRecordRouter = require("./routes/QuizRecordRoutes");
const userRouter = require("./routes/UserRoutes");

//configure mongoose
mongoose.set('strictQuery', false);
mongoose.connect(
  process.env.MONGODB_URI || "mongodb+srv://admin:admin@cnwebcluster.obhhajd.mongodb.net/QuizDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to MongoDB");
    }
  }
);

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
app.use("/api/quizzes", quizRouter);
app.use("/api/classes", classRouter);
app.use("/api/quizRecords", quizRecordRouter);
app.use("/api/users", userRouter);

app.listen(3005, () => {
  console.log("Server is running on port 3005");
  console.log(
    `Docs are available on http://localhost:3005/api/swagger`
  );
});

module.exports = app;
