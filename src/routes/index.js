var express = require('express');
var router = express.Router();
const discountRoute = require('./discount');
const voucherRouter = require('./voucher');
const productRouter = require('./product');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/discount', discountRoute);
router.use("/voucher", voucherRouter)
router.use("/product", productRouter);
module.exports = router;
