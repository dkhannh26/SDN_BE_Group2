var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require('cors');
require("dotenv").config();
var cors = require('cors');
var app = express();
const session = require('express-session');


const connection = require("./config/database");
const hostname = process.env.HOST_NAME;

var indexRouter = require("./routes/index");

var app = express();

app.use(cors())
// app.use(logger("dev"));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

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