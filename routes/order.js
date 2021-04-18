import { verifyToken } from "../middleware/authJWT.js";
import { Account, Order } from "../models/index.js";
import { throwErr, resMessage, resSend } from "../utils/patterns.js";

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

orderRouter.get("/detail", verifyToken, async (req, res) => {
  try {
    const order = new Order();
    await order.initByID(req.cart);
    resSend(res, 200, await order.getItems());
  } catch (err) {
    throwErr(err, res);
  }
});

orderRouter.post("/addItem", verifyToken, async (req, res) => {
  try {
    const order = new Order();
    await order.initByID(req.cart);
    await order.addItem(req.body.item);
    await order.save();
    resSend(res, 200, await order.getItems());
  } catch (err) {
    console.log(err);
    throwErr(err, res);
  }
});

export default orderRouter;
