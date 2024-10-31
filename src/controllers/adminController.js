require("dotenv").config();
const Account = require("../models/accounts");
const saltRounds = 10;
const bcrypt = require("bcrypt");

const getAccountList = async (req, res) => {
  try {
    let list = await Account.findWithDeleted({});
    return res.status(200).json({ message: "ok", list });
  } catch (error) {
    res.status(400).json({ EC: 1 });
    console.log(error);
  }
};

const createStaffAccount = async (req, res) => {
  let { username, password, email, address, phone } = req.body;

  const hashPassword = await bcrypt.hash(password, saltRounds);

  try {
    let checkUser = await Account.findOne({ username });
    let checkEmail = await Account.findOne({ email });

    if (checkEmail || checkUser) {
      res
        .status(200)
        .json({ success: false, message: "Username or email already exists" });
    } else {
      let account = await Account.create({
        username,
        password: hashPassword,
        email,
        address,
        phone,
        role: "staff",
      });
      res.status(200).json({ message: "ok", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteAccount = async (req, res) => {
  let id = req.params.accountId;
  try {
    let account = await Account.deleteById({ _id: id });
    return res
      .status(200)
      .json({ success: true, message: "Delete successful" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ success: false, message: error });
  }
};

const updateAccount = async (req, res) => {
  let id = req.params.accountId;

  let { email, address, phone } = req.body;

  try {
    let check = await Account.findOneWithDeleted({ email });
    let user = await Account.findOneWithDeleted({ _id: id });

    if (user.email === email) {
      let result = await Account.updateOne(
        { _id: id },
        { email, phone, address }
      );

      if (result.matchedCount === 1) {
        return res
          .status(200)
          .json({ success: true, message: "Account updated successfully" });
      }
    } else {
      if (check) {
        return res.status(200).json({
          success: false,
          message: "Email already exists in our system",
        });
      } else {
        let result = await Account.updateOne(
          { _id: id },
          { email, phone, address }
        );
        res.status(200).json({
          success: true,
          message: "Account updated successfully",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ success: false, message: error });
  }
};

const getAccount = async (req, res) => {
  let id = req.params.accountId;

  try {
    const user = await Account.findOneWithDeleted({ _id: id });

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
};

const accountRecovery = async (req, res) => {
  let id = req.params.accountId;

  try {
    let result = await Account.updateOneWithDeleted(
      { _id: id },
      { deleted: false }
    );
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
  }
};

const permanentlyDelete = async (req, res) => {
  let id = req.params.accountId;
  try {
    let account = await Account.deleteOne({ _id: id });

    return res
      .status(200)
      .json({ account, success: true, message: "Delete successfully" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ success: false, message: error });
  }
};

module.exports = {
  getAccountList,
  createStaffAccount,
  deleteAccount,
  updateAccount,
  getAccount,
  accountRecovery,
  permanentlyDelete,
};