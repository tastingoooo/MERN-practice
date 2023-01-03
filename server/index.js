const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRouter = require("./routes").auth;
const courseRouter = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => {
    console.log("connect to mongo altas");
  })
  .catch((e) => {
    console(e);
  });
//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/user", authRouter);
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRouter
); //用jwt保護資料不被竄改

app.listen(8080, () => {
  console.log("running on port 8080");
});
