import {
  checkDuplicateEmail,
  checkRolesExisted,
} from "../middleware/verifySignUp.js";
import { signin, signup } from "../controllers/auth.controller.js";
import express from "express";

const authRouter = express.Router();

authRouter.post("/signup", checkDuplicateEmail, checkRolesExisted, signup);
authRouter.post("/signin", signin);

export default authRouter;
