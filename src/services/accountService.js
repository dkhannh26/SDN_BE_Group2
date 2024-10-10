const aqp = require("api-query-params");
const bcrypt = require("bcrypt");
const Account = require("../models/accounts");

const loginService = async (username, password) => {
  try {
    const user = await Account.findOne({ username });
    if (user) {
      const hash = bcrypt.hash(password);
    } else {
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { loginService };
