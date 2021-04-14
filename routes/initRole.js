const express = require("express");
const { Role } = require("../models");
const { resMessage } = require("../utils/patterns");

const initRoleRouter = express.Router();

initRoleRouter.post("/", (req, res) => {
  Role.init();
  resMessage(res, 200, "Init successfully");
});

module.exports = initRoleRouter;
