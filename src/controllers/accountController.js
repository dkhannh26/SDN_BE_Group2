const Joi = require("joi");
const {
  loginService,
  createUserService,
} = require("../services/accountService");
const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  const data = await loginService(username, password);
  res.status(200).json({
    data: data,
  });
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

module.exports = { handleLogin, createUser };
