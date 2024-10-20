var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const session = require("express-session");
const connection = require("./config/database");
const hostname = process.env.HOST_NAME;
const cors = require("cors");
var indexRouter = require("./routes/index");
var delay = require("./middleware/delay");
var app = express();

app.use(
  session({
    secret: "dotai_secret_key", // Secret key để ký session ID cookie
    resave: false, // Không lưu session nếu không thay đổi
    saveUninitialized: true, // Lưu session mới ngay cả khi nó chưa được thay đổi
    cookie: {
      maxAge: 60000, // Thời gian sống của cookie (ở đây là 1 phút)
      secure: false, // Đặt thành true nếu sử dụng HTTPS
    },
  })
);
// app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

module.exports = app;
