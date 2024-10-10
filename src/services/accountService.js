const aqp = require("api-query-params");
const bcrypt = require("bcrypt");
const Account = require("../models/accounts");
const saltRounds = 10;

const loginService = async (username, password) => {
  try {
    const user = await Account.findOne({ username });
    if (user) {
      const isMatchPassword = await bcrypt.compare(password, user.password);

      if (!isMatchPassword) {
        return {
          message: "Username or password is incorrect",
        };
      } else {
        return {
          message: "Login successful",
        };
      }
    } else {
      return {
        message: "Account does not exist",
      };
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const createUserService = async (
  username,
  email,
  password,
  phone,
  address,
  role
) => {
  try {
    const user = await Account.findOne({ username });
    if (user) {
      return {
        message: "Username already exists",
      };
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
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = { loginService, createUserService };
