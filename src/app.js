var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const fileUpload = require("express-fileupload");

const connection = require("./config/database");
const hostname = process.env.HOST_NAME;

var indexRouter = require("./routes/index");
var productRouter = require("./routes/productRouter");

var app = express();

app.use(fileUpload());
// app.use(logger("dev"));

app.use(cookieParser());

var cors = require('cors')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
app.use("/product", productRouter);

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
