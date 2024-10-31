var express = require('express');
var router = express.Router();
const discountRoute = require('./discount');
const productRouter = require('./product');
const sizeRouter = require('./size');
const voucherRouter = require('./voucher');
var cartRouter = require("./cart");
var orderRouter = require("./order");
var paymentRouter = require("./payment");


router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.use("/order", orderRouter);
router.use("/cart", cartRouter);
router.use("/voucher", voucherRouter);
router.use("/payment", paymentRouter);

router.use('/discount', discountRoute);
router.use("/product", productRouter);
router.use("/voucher", voucherRouter)
router.use("/size", sizeRouter)
module.exports = router;
