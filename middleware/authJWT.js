import jwt from "jsonwebtoken";
import { resMessage, throwErr } from "../utils/patterns.js";

function verifyToken(req, res, next) {
  const token = req.headers["x-access-token"];

  if (!token) {
    return resMessage(res, 403, "No token provided!");
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return resMessage(res, 401, "Unauthorized!");
    }
    req.accountID = decoded.id;
    req.roles = decoded.roles;
    next();
  });
}

async function isAdmin(req, res, next) {
  try {
    if (req.roles.includes("seller")) next();
  } catch (err) {
    throwErr(err, res);
  }
  return resMessage(res, 403, "Require Seller Role!");
}

export { verifyToken, isAdmin };
