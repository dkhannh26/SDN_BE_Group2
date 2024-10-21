var express = require('express');
var router = express.Router();
const discountRoute = require('./discount');
const voucherRouter = require('./voucher');
var cartRouter = require("./cart");


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.use("/cart", cartRouter)
router.use("/voucher", voucherRouter);
module.exports = router;
