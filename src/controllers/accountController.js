const Joi = require("joi");
const session = require("express-session");

const {
  loginService,
  createUserService,
} = require("../services/accountService");
const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  const data = await loginService(username, password);
  if (data.message === "Login successful") {
    req.session.userId = username;
  }
  res.status(200).json(data);
};

const createUser = async (req, res) => {
  const { username, email, password, phone, address, role } = req.body;
  const data = await createUserService(
    username,
    email,
    password,
    phone,
    address,
    role
  );
  res.status(200).json(data);
};

const handleLogout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error when logging out" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logout successful" });
  });
};
module.exports = { handleLogin, createUser, handleLogout };
