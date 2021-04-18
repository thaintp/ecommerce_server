import { verifyToken } from "../middleware/authJWT.js";
import { Account, Order } from "../models/index.js";
import { throwErr, resSend } from "../utils/patterns.js";

import express from "express";

const orderRouter = express.Router();

orderRouter.post("/", verifyToken, async (req, res) => {
  try {
    const cart = await Account.order(req.accountID);
    resSend(res, 200, cart);
  } catch (err) {
    return throwErr(err, res);
  }
});

orderRouter.get("/detail", verifyToken, async (req, res) => {
  try {
    const order = new Order();
    await order.initByID(req.cart);
    resSend(res, 200, await order.getModelDetail());
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
    resSend(res, 200, await order.getModelDetail());
  } catch (err) {
    console.log(err);
    throwErr(err, res);
  }
});

orderRouter.delete("/removeItem", verifyToken, async (req, res) => {
  try {
    const order = new Order();
    await order.initByID(req.cart);
    await order.removeItem(req.body.item);
    await order.save();
    resSend(res, 200, await order.getModelDetail());
  } catch (err) {
    console.log(err);
    throwErr(err, res);
  }
});

export default orderRouter;
