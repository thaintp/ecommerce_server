import express from "express";
import { Role } from "../models/index.js";
import { resMessage } from "../utils/patterns.js";

const initRoleRouter = express.Router();

initRoleRouter.post("/", (req, res) => {
  Role.init();
  resMessage(res, 200, "Init successfully");
});

export default initRoleRouter;
