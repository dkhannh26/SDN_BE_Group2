var express = require("express");
var router = express.Router();
const Account = require("../models/accounts");
const {
  handleLogin,
  createUser,
  handleLogout,
  forgotPassword,
  resetPassword,
} = require("../controllers/accountController");

router.post("/login", handleLogin);

router.post("/register", createUser);

router.post("/logout", handleLogout);

router.get("/:id");

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:username/:token", resetPassword);

module.exports = router;
