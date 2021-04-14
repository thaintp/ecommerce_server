const authJWT = require("../middleware/authJWT");
const controller = require("../controllers/account.controller");
const express = require("express");

const accountRouter = express.Router();

accountRouter.get("/all", controller.allAccess);

accountRouter.get("/user", authJWT.verifyToken, controller.userBoard);

accountRouter.get(
  "/seller",
  authJWT.verifyToken,
  authJWT.isAdmin,
  controller.adminBoard
);

module.exports = accountRouter;
