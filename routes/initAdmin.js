import express from "express";
import { Account } from "../models/index.js";
import { resMessage } from "../utils/patterns.js";

const initAdminRouter = express.Router();

initAdminRouter.post("/", (req, res) => {
  Account.init();
  resMessage(res, 200, "Init successfully");
});

export default initAdminRouter;
