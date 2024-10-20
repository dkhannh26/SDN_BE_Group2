var express = require("express");

var router = express.Router();
var accountRouter = require("./accountRouter");

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.use("/account", accountRouter);
module.exports = router;
