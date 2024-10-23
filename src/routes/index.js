var express = require("express");

var router = express.Router();
var accountRouter = require("./accountRouter");
var adminRouter = require("./adminRouter");

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.use("/account", accountRouter);
router.use("/admin", adminRouter);

module.exports = router;
