const {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} = require("../email/email");
const Account = require("../models/accounts");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const session = require("express-session");
const crypto = require("crypto");
const aqp = require("api-query-params");
const saltRounds = 10;

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Account.findOne({ username });
    if (user) {
      const isMatchPassword = await bcrypt.compare(password, user.password);

      if (!isMatchPassword) {
        return res
          .status(404)
          .json({ message: "Username or password is incorrect" });
      } else {
        req.session.userId = username;

        return res.status(200).json({ message: "Login successful" });
      }
    } else {
      return res.status(404).json({ message: "Account does not exist" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: error });
  }
};

const createUser = async (req, res) => {
  const { username, email, password, phone, address, role } = req.body;

  try {
    const user = await Account.findOne({ username });
    if (user) {
      return res.status(404).json({
        message: "Username already exists",
      });
    }
    //hash password
    const hashPassword = await bcrypt.hash(password, saltRounds);
    let result = await Account.create({
      username,
      email,
      password: hashPassword,
      address,
      phone,
      role,
    });
    return res
      .status(404)
      .json({ user: result, message: "User created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: error });
  }
};

const handleLogout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error when logging out" });
    }
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Logout successful" });
  });
};
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const account = await Account.findOne({ email });

    if (!account) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    // const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    // account.resetPasswordToken = resetToken;
    // account.resetPasswordExpiresAt = resetTokenExpiresAt;

    // await account.save();

    // send email
    await sendPasswordResetEmail(
      account.email,
      `${process.env.CLIENT_URL}/reset-password/${account.username}/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, username } = req.params;
    const { password } = req.body;

    const account = await Account.findOne({ username });

    if (!account) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // update password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    account.password = hashedPassword;
    await account.save();

    await sendResetSuccessEmail(account.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  handleLogin,
  createUser,
  handleLogout,
  forgotPassword,
  resetPassword,
};
