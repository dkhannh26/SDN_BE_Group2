var express = require('express');
var router = express.Router();
var cartRouter = require("./cart");
var voucherRouter = require("./voucher");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.use("/cart", cartRouter)
router.use("/voucher", voucherRouter);
module.exports = router;
