var express = require("express");
var router = express.Router();
const Account = require("../models/accounts");
const { handleLogin, createUser } = require("../controllers/accountController");
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

router.post("/login", handleLogin);

router.post("/register", createUser);

router.get("/recover");

module.exports = router;
