import { verifyToken, isAdmin } from "../middleware/authJWT.js";
import controller from "../controllers/account.controller.js";
import express from "express";

const accountRouter = express.Router();

accountRouter.get("/all", controller.allAccess);

accountRouter.get("/user", verifyToken, controller.userBoard);

accountRouter.get("/seller", verifyToken, isAdmin, controller.adminBoard);

export default accountRouter;
