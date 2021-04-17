import { Account } from "../models";
import { throwErr, resMessage } from "../utils/patterns";

async function checkValidItems(req, res, next) {
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

export { checkValidItems };
