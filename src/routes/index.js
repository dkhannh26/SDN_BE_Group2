var express = require('express');
var router = express.Router();

const discountRoute = require('./discount');

router.use('/discount', discountRoute);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});



module.exports = router;
