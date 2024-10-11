var express = require("express");
var router = express.Router();
const Account = require("../models/accounts");
const {
  handleLogin,
  createUser,
  handleLogout,
  forgotPassword,
  resetPassword,
  viewProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/accountController");

router.post("/login", handleLogin);

router.post("/register", createUser);

router.post("/logout", handleLogout);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:username/:token", resetPassword);

router.get("/:accountId", viewProfile);

router.put("/:accountId", updateProfile);

router.delete("/:accountId", deleteProfile);

module.exports = router;
