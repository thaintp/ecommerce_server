import express from "express";
import {
  postSampleProducts,
  getAllProducts,
  getAllProductsByBrand,
  getProduct,
  putProduct,
  deleteProduct,
} from "../middleware/product.js";

const productRouter = express.Router();

productRouter.get("/:id", getProduct, (req, res) => {
  res.json(res.product);
});

productRouter.get("/", getAllProducts, (req, res) => {
  res.json(res.allProducts);
});

productRouter.get("/brand/:name", getAllProductsByBrand, (req, res) => {
  res.json(res.allProducts);
});

productRouter.put("/:id", putProduct, (req, res) => {
  res.json(res.product);
});

productRouter.delete("/:id", deleteProduct, (req, res) => {
  res.json(res.message);
});
productRouter.post("/postSampleDatasets", postSampleProducts, (req, res) => {
  res.json(res.products);
});

export default productRouter;
