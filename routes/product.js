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

productRouter.delete("/:id", deleteProduct, (req, res) => {
  resSend(res, 200, res.message);
});
productRouter.post("/postSampleDatasets", postSampleProducts, (req, res) => {
  resSend(res, 200, res.products);
});

export default productRouter;
