import { isAdmin, verifyToken } from "../middleware/authJWT.js";
import { Account, Order, Item } from "../models/index.js";
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

orderRouter.post("/update", verifyToken, isAdmin, async (req, res) => {
  try {
    const order = new Order();
    await order.initByID(req.body.id);
    if (order.getState() === "Planning" && req.body.state === "Canceled") {
      await order.updateState("Canceled");
      await order.removeAllItems();
      await Account.crateNewCartByOldCart(req.body.id);
    }
    if (order.getState() === "Pending")
      if (req.body.state === "Completed") {
        order.updateState("Completed");
      } else if (req.body.state === "Canceled") {
        order.updateState("Canceled");
        await order.removeAllItems();
      }

    await order.save();
    resSend(res, 200, await order.getModelDetail());
  } catch (err) {
    console.log(err);
    return throwErr(err, res);
  }
});

orderRouter.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.getAll();
    return resSend(res, 200, orders);
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

orderRouter.put("/changeItem/:id", verifyToken, async (req, res) => {
  try {
    await Item.updateById(req.params.id, req.body.item);
    const order = new Order();
    await order.initByID(req.cart);
    resSend(res, 200, await order.update());
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
