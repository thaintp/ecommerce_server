import { verifyToken } from "../middleware/authJWT.js";
import { Account } from "../models/index.js";
import { throwErr, resMessage } from "../utils/patterns.js";

import express from "express";

const orderRouter = express.Router();

orderRouter.post("/", verifyToken, async (req, res) => {
  try {
    await Account.order(req.accountID, req.body.items);
    resMessage(res, 200, "Order successfully");
  } catch (err) {
    throwErr(err, res);
  }
});

export default orderRouter;
