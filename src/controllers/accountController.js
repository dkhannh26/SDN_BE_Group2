require("dotenv").config();
const {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerifyCreate,
} = require("../nodemailer/email");
const Account = require("../models/accounts");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const session = require("express-session");
const crypto = require("crypto");
const aqp = require("api-query-params");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Account.findOne({ username });
    if (user) {
      const isMatchPassword = await bcrypt.compare(password, user.password);

      if (!isMatchPassword) {
        return res.status(200).json({
          EC: 1,
          message: "Username or password is incorrect",
        });
      } else {
        req.session.userId = username;

        return res
          .status(200)
          .json({ EC: 0, message: "Login successful", user });
      }
    } else {
      return res.status(200).json({ EC: 1, message: "Account does not exist" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: error });
  }
};

const verifyCreate = async (req, res) => {
  const { email } = req.body;
  try {
    const account = await Account.findOne({ email });
    if (account) {
      return res
        .status(400)
        .json({ success: false, message: "Your email already exist" });
    }

    const token = jwt.sign(req.body, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    // send email
    await sendVerifyCreate(
      email,
      `${process.env.CLIENT_URL}/account/register/${token}`
    );

    res.status(200).json({
      success: true,
      message: "An email has been sent to your account",
    });
  } catch (error) {
    console.log("Error in sending email ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const createUser = async (req, res) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const { username, email, password, phone, address, role } = decoded;

  try {
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

    // await sendWelcomeEmail(email);
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

    const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    // send email
    await sendPasswordResetEmail(
      account.email,
      `${process.env.CLIENT_URL}/account/reset-password/${token}`
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
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const { email } = decoded;

    const { password } = req.body;

    const account = await Account.findOne({ email });

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

const viewProfile = async (req, res) => {
  let id = req.params.accountId;
  try {
    const account = await Account.findOne({ _id: id });
    res.status(200).json({ account });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
};

const updateProfile = async (req, res) => {
  let id = req.params.accountId;
  let { address, phone, email } = req.body;

  try {
    let check = await Account.findOne({ email });
    if (!check) {
      let user = await Account.updateOne(
        { _id: id },
        { address, phone, email }
      );
      return res.status(200).json({ user, message: "Update successful" });
    } else {
      return res
        .status(404)
        .json({ message: "Email already exists in our system" });
    }
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const deleteProfile = async (req, res) => {
  try {
    let id = req.params.accountId;
    let account = await Account.deleteById({ _id: id });
    return res.status(200).json({ account, message: "Delete successful" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: error });
  }
};
module.exports = {
  handleLogin,
  createUser,
  handleLogout,
  forgotPassword,
  resetPassword,
  viewProfile,
  updateProfile,
  deleteProfile,
  verifyCreate,
};
