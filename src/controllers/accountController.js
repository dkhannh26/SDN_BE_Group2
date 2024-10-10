const Joi = require("joi");
const { loginService } = require("../services/accountService");
const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  const data = await loginService(username, password);
  res.status(200).json({
    message: data,
  });
};

module.exports = { handleLogin };
