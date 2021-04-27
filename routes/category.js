import express from "express";
import { verifyToken, isAdmin } from "../middleware/authJWT.js";
import { throwErr, resSend } from "../utils/patterns.js";
import { getCategories, createCategory } from "../middleware/category.js";

const categoryRouter = express.Router();

categoryRouter.get("/", getCategories, (req, res) => {
  try {
    resSend(res, 200, res.categories);
  } catch (err) {
    throwErr(err, res);
  }
});

categoryRouter.post(
  "/",
  verifyToken,
  isAdmin,
  createCategory,
  async (req, res) => {
    try {
      resSend(res, 200, res.category);
    } catch (err) {
      throwErr(err, res);
    }
  }
);

export default categoryRouter;
