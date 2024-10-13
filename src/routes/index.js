var express = require('express');
var router = express.Router();
const discountRoute = require('./discount');
const voucherRouter = require('./voucher');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/discount', discountRoute);
router.use("/voucher", voucherRouter)

module.exports = router;
