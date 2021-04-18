import jwt from "jsonwebtoken";
import md5 from "md5";
import { Account, Role } from "../models/index.js";
import { throwErr, resMessage } from "../utils/patterns.js";

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
      return resMessage(res, 404, "Your e-mail/password is invalid!");
    }
    const hashPass = md5(req.body.password);
    const { _id, name, email, password, cart, avatar, roles } = account;
    if (hashPass !== password) {
      return resMessage(res, 401, "Your e-mail/password is invalid!");
    }
    const accessToken = jwt.sign(
      { id: _id, email, cart, roles: roles.map((role) => role.name) },
      process.env.SECRET,
      {
        expiresIn: 86400,
      }
    );
    return res.status(200).send({
      id: _id,
      name,
      email,
      accessToken,
      avatar,
      roles: roles.map((role) => role.name),
    });
  } catch (err) {
    throwErr(err, res);
  }
}

async function update(req, res) {
  try {
    const account = await Account.findById(req.accountID);
    const { _id, name, email, cart, avatar, roles } = account;
    const accessToken = jwt.sign(
      { id: _id, email, cart, roles: roles.map((role) => role.name) },
      process.env.SECRET,
      {
        expiresIn: 86400,
      }
    );
    return res.status(200).send({
      id: _id,
      name,
      email,
      accessToken,
      avatar,
      roles: roles.map((role) => role.name),
    });
  } catch (err) {
    throwErr(err, res);
  }
}
export { signup, signin, update };
