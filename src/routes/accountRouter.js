var express = require("express");
var router = express.Router();
const Account = require("../models/accounts");
const { handleLogin } = require("../controllers/accountController");
/* GET users listing. */
// router.post("/", async function (req, res, next) {
//   let data = req.body;
//   let result = await Customer.create({
//     name: data.name,
//     address: data.address,
//     phone: data.phone,
//     email: data.email,
//     image: data.image,
//     description: data.description,
//   });
//   res.send(result);
// });

router.get("/login", handleLogin);

router.get("/register", async function (req, res, next) {
  res.send("hi");
});

router.get("/recover");

module.exports = router;
