const express = require("express");
const {
  postSampleProducts,
  getAllProducts,
  getProduct,
  putProduct,
  deleteProduct,
} = require("../middleware/product");

const productRouter = express.Router();

productRouter.get("/:id", getProduct, (req, res) => {
  res.json(res.product);
});

productRouter.get("/", getAllProducts, (req, res) => {
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

module.exports = productRouter;
