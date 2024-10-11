var express = require('express');
var router = express.Router();
const discountRoute = require('./discount');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/discount', discountRoute);


module.exports = router;
