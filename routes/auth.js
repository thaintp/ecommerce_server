const {
  checkDuplicateEmail,
  checkRolesExisted,
} = require("../middleware/verifySignUp");
const { signin, signup } = require("../controllers/auth.controller");
const express = require("express");

const authRouter = express.Router();

authRouter.post("/signup", checkDuplicateEmail, checkRolesExisted, signup);
authRouter.post("/signin", signin);

module.exports = authRouter;
