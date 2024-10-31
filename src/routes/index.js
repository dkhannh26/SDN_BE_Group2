var express = require("express");
var router = express.Router();
const discountRoute = require("./discount");
const productRouter = require("./product");
const sizeRouter = require("./size");
const voucherRouter = require("./voucher");
const statisticRouter = require("./statistic");
var accountRouter = require("./accountRouter");
var adminRouter = require("./adminRouter");
const importRouter = require("./import");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/discount", discountRoute);
router.use("/product", productRouter);
router.use("/size", sizeRouter);
router.use("/statistic", statisticRouter);
router.use("/account", accountRouter);

router.use("/voucher", voucherRouter);
router.use("/admin", adminRouter);
router.use("/import", importRouter);
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports = router;
