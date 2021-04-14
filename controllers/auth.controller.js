const jwt = require("jsonwebtoken");
const md5 = require("md5");
const { Account, Role } = require("../models");
const { throwErr, resMessage } = require("../utils/patterns");

async function signup(req, res) {
  try {
    const account = new Account(
      req.body.name,
      req.body.email,
      md5(req.body.password)
    );
    if (req.body.roles) {
      const ids = await Role.getIdsNotSeller(req.body.roles);
      account.setRoles(ids);
    }
    await account.save();
    resMessage(res, 201, "User was registered successfully!");
  } catch (err) {
    throwErr(err, res);
  }
}

async function signin(req, res) {
  try {
    const account = await Account.findByEmail(req.body.email);
    if (!account) {
      return resMessage(res, 404, "User not found");
    }
    const hashPass = md5(req.body.password);
    const { _id, name, email, password } = account;
    if (hashPass !== password) {
      return resMessage(res, 401, "Wrong Password");
    }
    const accessToken = jwt.sign({ id: _id }, process.env.SECRET, {
      expiresIn: 86400,
    });
    return res.status(200).send({
      id: _id,
      name,
      email,
      accessToken,
    });
  } catch (err) {
    throwErr(err, res);
  }
}

module.exports = { signup, signin };
