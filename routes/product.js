import express from "express";
import {
  postSampleProducts,
  getAllProducts,
  getAllProductsByBrand,
  getProduct,
  putProduct,
  deleteProduct,
} from "../middleware/product.js";
import { resSend } from "../utils/patterns.js";
import { verifyToken, isAdmin } from "../middleware/authJWT.js";

const productRouter = express.Router();

productRouter.get("/:id", getProduct, (req, res) => {
  resSend(res, 200, res.product);
});

productRouter.get("/", getAllProducts, (req, res) => {
  resSend(res, 200, res.allProducts);
});

productRouter.get("/brand/:name", getAllProductsByBrand, (req, res) => {
  resSend(res, 200, res.allProducts);
});

productRouter.put("/:id", putProduct, (req, res) => {
  resSend(res, 200, res.product);
});

productRouter.delete(
  "/:id",
  verifyToken,
  isAdmin,
  deleteProduct,
  (req, res) => {
    resSend(res, 200, res.message);
  }
);
productRouter.post("/postSampleDatasets", postSampleProducts, (req, res) => {
  resSend(res, 200, res.products);
});

export default productRouter;
