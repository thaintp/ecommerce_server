import { Category, CategoryProduct, Product } from "../models/index.js";
import { resSend, throwErr } from "../utils/patterns.js";
import mongoose from "mongoose";

async function getProduct(req, res, next) {
  try {
    res.product = await Product.getById(req.params.id);
  } catch (err) {
    return throwErr(err, res);
  }
  return next();
}

async function paginate(req, res, next) {
  try {
    res.products = await Product.paginate(
      parseInt(req.params.page),
      parseInt(req.params.quantity)
    );
  } catch (err) {
    console.log(err);
    return throwErr(err, res);
  }
  return next();
}

async function getMaxPaginate(req, res, next) {
  try {
    res.max = await (
      await Product.getMaxPaginate(parseInt(req.params.quantity))
    ).toString();
  } catch (err) {
    console.log(err);
    return throwErr(err, res);
  }
  return next();
}

async function getWithCategories(req, res, next) {
  try {
    res.products = await Product.getWithCategories();
  } catch (err) {
    console.log(err);
    return throwErr(err, res);
  }
  return next();
}

async function getProducts(req, res, next) {
  try {
    const query = req.query;
    const filter = {};
    if (query.name) {
      filter.name = { $regex: new RegExp(query.name, "i") };
    }
    if (query.id) {
      filter._id = mongoose.Types.ObjectId(query.id);
    }
    res.products = await Product.get(
      filter,
      query.page,
      query.limit,
      query.category,
      query.sort ? JSON.parse(query.sort) : undefined
    );
  } catch (err) {
    console.log(err);
    return throwErr(err, res);
  }
  return next();
}

async function count(req, res, next) {
  try {
    const query = req.query;
    const filter = {};
    if (query.name) {
      filter.name = { $regex: new RegExp(query.name, "i") };
    }
    if (query.id) {
      filter._id = mongoose.Types.ObjectId(query.id);
    }
    const count = await Product.count(filter, query.category);
    res.count = count.toString();
  } catch (err) {
    console.log(err);
    return throwErr(err, res);
  }
  return next();
}

async function search(req, res, next) {
  try {
    res.products = await Product.search(req.query.name);
  } catch (err) {
    console.log(err);
    return throwErr(err, res);
  }
  return next();
}

async function getAllProductsByBrand(req, res, next) {
  try {
    res.allProducts = await Product.getAllByBrand(req.params.name);
  } catch (err) {
    return throwErr(err, res);
  }
  return next();
}

async function putProduct(req, res, next) {
  try {
    const photos = [req.photos, req.body.photos]
      .flat(2)
      .filter((photo) => photo != undefined);

    const body = req.body;
    res.newProduct = await Product.updateById(req.params.id, {
      ...body,
      photos,
      categories: JSON.parse(body.categories.split(",")),
      sizes: JSON.parse(body.sizes.split(",")),
      colors: JSON.parse(body.colors),
    });
  } catch (err) {
    console.log(err);
    return throwErr(err, res);
  }
  return next();
}

async function deleteProduct(req, res, next) {
  try {
    await Product.removeById(req.params.id);
    res.message = "Delete successfully";
  } catch (err) {
    return throwErr(err, res);
  }
  return next();
}

async function getAllProducts(req, res, next) {
  try {
    res.allProducts = await Product.getAll();
  } catch (err) {
    return throwErr(err, res);
  }
  return next();
}

async function postProduct(req, res, next) {
  try {
    const product = new Product();
    const body = req.body;
    req.product = await product.create({
      photos: req.photos,
      ...body,
      categories: JSON.parse(body.categories),
      sizes: JSON.parse(body.sizes),
      colors: JSON.parse(body.colors),
    });
    await product.save();
  } catch (err) {
    return throwErr(err, res);
  }
  return next();
}

async function sampleUpdateCategory(req, res, next) {
  try {
    let products = await Product.getAll();
    products = products.map((product) => product._id);
    let categories = await Category.getCategories();
    categories = categories.map((category) => category._id);
    for (let [index, product] of products.entries()) {
      await CategoryProduct.addCategoriesToProduct(
        categories.slice(
          index % categories.length,
          (index + 2) % categories.length
        ),
        product
      );
    }
  } catch (err) {
    return throwErr(err, res);
  }
  next();
}

async function postSampleProducts(req, res, next) {
  try {
    const products = [];
    const ProductModel = Product.getMongooseModel();
    let product1 = new ProductModel();

    product1.photos = [
      "https://i.loli.net/2021/04/19/6xBWmATQUcVCnIv.jpg",
      "https://i.loli.net/2021/04/11/APTRESngYMcu5ZD.jpg",
      "https://i.loli.net/2021/04/19/7QpyXCDszmuLFvh.jpg",
    ];
    product1.name = "Collete Stretch Linen Minidress";
    product1.categories = ["Casual dresses", "Going out dresses"];
    product1.brand = "Zara";
    product1.price = 69.0;
    product1.sizes = ["S", "M", "L", "XL"];
    product1.colors = [
      "#ff5f6d",
      "rgba(255, 195, 113, 0.5)",
      "rgba(95, 109, 255, 0.5)",
      "rgba(61, 61, 63, 0.5)",
      "rgba(237, 237, 237, 0.5)",
    ];
    product1.quantity = 200;
    product1.description =
      "Model wearing size S\n- Chest: 36”\n- Length: 25.75”";
    await product1.save();
    products.push(product1);

    let product2 = new ProductModel();
    product2.photos = [
      "https://i.loli.net/2021/04/11/APTRESngYMcu5ZD.jpg",
      "https://i.loli.net/2021/04/19/xu3wG1SCpqZLWmI.jpg",
    ];
    product2.name = "Plunge V-neck Denim Mini Dress";
    product2.categories = ["Casual dresses", "Sexy"];
    product2.brand = "Chanel";
    product2.price = 59.0;
    product2.sizes = ["S", "M", "L"];
    product2.colors = [
      "#f100aa",
      "rgba(50, 0, 200, 0.5)",
      "rgba(50, 200, 50, 0.5)",
    ];
    product2.quantity = 167;
    product2.description =
      "Model wearing size S\n- Chest: 39”\n- Length: 23.75”";
    await product2.save();
    products.push(product2);

    res.products = products;
  } catch (err) {
    return throwErr(err, res);
  }

  return next();
}

export {
  getProduct,
  getAllProducts,
  getAllProductsByBrand,
  putProduct,
  deleteProduct,
  postSampleProducts,
  postProduct,
  paginate,
  getMaxPaginate,
  search,
  getProducts,
  count,
  sampleUpdateCategory,
  getWithCategories,
};
