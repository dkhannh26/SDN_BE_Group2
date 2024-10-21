var express = require('express');
var router = express.Router();
const discountRoute = require('./discount');
const productRouter = require('./product');
const sizeRouter = require('./size');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/discount', discountRoute);
router.use("/product", productRouter);
router.use("/size", sizeRouter)
module.exports = router;
