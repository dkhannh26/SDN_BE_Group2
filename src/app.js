var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
require("dotenv").config();

const connection = require("./config/database");
const hostname = process.env.HOST_NAME;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var sizeRouter = require("./routes/size");

var app = express();

// app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/size", sizeRouter)

// (async () => {
//   try {
//     //test connection
//     await connection();
//     app.listen(port, () => {
//       console.log(`Example app listening on port ${port}`);
//     });
//   } catch (error) {
//     console.log("Error: " + error);
//   }
// })();

module.exports = app;
