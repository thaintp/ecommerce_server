const { Product } = require("../models");
const mongoose = require("mongoose");

async function getProduct(req, res, next) {
  try {
    res.product = await Product.findById(
      mongoose.Types.ObjectId(req.params.id)
    ).lean();
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
  return next();
}

async function putProduct(req, res, next) {
  try {
    res.product = await Product.findByIdAndUpdate(
      mongoose.Types.ObjectId(req.params.id),
      {
        ...req.params.product,
      }
    );
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
  return next();
}

async function deleteProduct(req, res, next) {
  try {
    await Product.findByIdAndDelete(mongoose.Types.ObjectId(req.params.id));
    res.message = "Delete successfully";
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
  return next();
}

async function getAllProducts(req, res, next) {
  try {
    res.allProducts = await Product.find().lean();
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
  return next();
}

async function postSampleProducts(req, res, next) {
  try {
    const products = [];
    let product1 = new Product();

    product1.photos = ["https://sm.ms/image/APTRESngYMcu5ZD"];
    product1.name = "Collete Stretch Linen Minidress";
    product1.categories = ["Casual dresses", "Going out dresses"];
    product1.brand = "Zara";
    product1.price = 69.0;
    product1.sizes = ["S", "M", "L", "XL"];
    product1.colors = ["Blue", "Brown", "White", "Black"];
    product1.quantity = 200;
    product1.description =
      "Model wearing size S\n- Chest: 36”\n- Length: 25.75”";
    await product1.save();
    products.push(product1);

    let product2 = new Product();
    product2.photos = ["https://sm.ms/image/APTRESngYMcu5ZD"];
    product2.name = "Plunge V-neck Denim Mini Dress";
    product2.categories = ["Casual dresses", "Sexy"];
    product2.brand = "Chanel";
    product2.price = 59.0;
    product2.sizes = ["S", "M", "L"];
    product2.colors = ["White", "Black"];
    product2.quantity = 58;
    product2.description =
      "Model wearing size S\n- Chest: 39”\n- Length: 23.75”";
    await product2.save();
    products.push(product2);

    res.products = products;
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }

  return next();
}

module.exports = {
  getProduct,
  getAllProducts,
  putProduct,
  deleteProduct,
  postSampleProducts,
};
