import express from "express";
import {
  postSampleProducts,
  getAllProducts,
  getAllProductsByBrand,
  getProduct,
  putProduct,
  deleteProduct,
  postProduct,
} from "../middleware/product.js";
import { resSend } from "../utils/patterns.js";
import { verifyToken, isAdmin } from "../middleware/authJWT.js";
import { uploadImages } from "../middleware/image.js";

const productRouter = express.Router();

productRouter.get("/:id", getProduct, (req, res) => {
  resSend(res, 200, res.product);
});

productRouter.get("/", getAllProducts, (req, res) => {
  resSend(res, 200, res.allProducts);
});
productRouter.post("/", verifyToken, uploadImages, postProduct, (req, res) => {
  resSend(res, 200, req.product);
});

productRouter.get("/brand/:name", getAllProductsByBrand, (req, res) => {
  resSend(res, 200, res.allProducts);
});

productRouter.put("/:id", verifyToken, uploadImages, putProduct, (req, res) => {
  resSend(res, 200, res.newProduct);
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
