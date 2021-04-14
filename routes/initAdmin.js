const express = require("express");
const { Account } = require("../models");
const { resMessage } = require("../utils/patterns");

const initAdminRouter = express.Router();

initAdminRouter.post("/", (req, res) => {
  Account.init();
  resMessage(res, 200, "Init successfully");
});

module.exports = initAdminRouter;
