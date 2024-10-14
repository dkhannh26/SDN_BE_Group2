var express = require('express');
var router = express.Router();
const discountRouter = require('./discount');
const voucherRouter = require('./voucher');
const accountRouter = require('./account');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/discount', discountRouter);
router.use("/voucher", voucherRouter)
router.use("/account", accountRouter)

module.exports = router;
