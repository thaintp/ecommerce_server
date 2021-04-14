const { Account, Role } = require("../models");
const { throwErr, resMessage } = require("../utils/patterns");

async function checkDuplicateEmail(req, res, next) {
  try {
    if (await Account.exist(req.body.email)) {
      return resMessage(res, 400, "Failed! Email is already in use!");
    }
  } catch (err) {
    throwErr(err, res);
    return;
  }
  next();
}

function checkRolesExisted(req, res, next) {
  if (req.body.roles) {
    for (let role of req.body.roles) {
      if (!Role.include(role)) {
        return resMessage(res, 400, `Failed! Role ${role} does not exists!`);
      }
    }
  }
  next();
}

module.exports = { checkDuplicateEmail, checkRolesExisted };
