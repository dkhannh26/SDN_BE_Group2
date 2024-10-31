var express = require("express");

var router = express.Router();
const discountRoute = require('./discount');
const productRouter = require('./product');
const sizeRouter = require('./size');
const voucherRouter = require('./voucher');
const statisticRouter = require("./statistic");
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/discount', discountRoute);
router.use("/product", productRouter);
router.use("/voucher", voucherRouter)
router.use("/size", sizeRouter)
router.use("/statistic", statisticRouter)
var accountRouter = require("./accountRouter");


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.use("/account", accountRouter);
module.exports = router;
