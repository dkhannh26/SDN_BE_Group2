var express = require('express');
var router = express.Router();
var orderRouter = require("./order");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.use("/order", orderRouter)

module.exports = router;
