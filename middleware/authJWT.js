const jwt = require("jsonwebtoken");
const { resMessage, throwErr } = require("../utils/patterns");
const { Account, Role } = require("../models");

function verifyToken(req, res, next) {
  const token = req.headers["x-access-token"];

  if (!token) {
    return resMessage(res, 403, "No token provided!");
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return resMessage(res, 401, "Unauthorized!");
    }
    req.userId = decoded.id;
    next();
  });
}

async function isAdmin(req, res, next) {
  try {
    const account = Account.findById(req.userId);
    if (Role.isSellerByIds(account.roles)) return next();
  } catch (err) {
    throwErr(err, res);
  }
  return resMessage(res, 403, "Require Seller Role!");
}

module.exports = { verifyToken, isAdmin };
