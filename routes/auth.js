import {
  checkDuplicateEmail,
  checkRolesExisted,
} from "../middleware/verifySignUp.js";
import { verifyToken } from "../middleware/authJWT.js";
import { signin, signup, update } from "../controllers/auth.controller.js";
import express from "express";

const authRouter = express.Router();

authRouter.post("/signup", checkDuplicateEmail, checkRolesExisted, signup);
authRouter.post("/signin", signin);
authRouter.post("/update", verifyToken, update);

export default authRouter;
