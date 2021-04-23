import express from "express";
import { verifyToken } from "../middleware/authJWT.js";
import { throwErr, resSend } from "../utils/patterns.js";
import { Item } from "../models/Item.js";

const itemRouter = express.Router();

itemRouter.put("/:id", verifyToken, async (req, res) => {
  try {
    const newItem = await Item.updateById(req.params.id, req.body);
    resSend(res, 200, newItem);
  } catch (err) {
    throwErr(err, res);
  }
});

export default itemRouter;
