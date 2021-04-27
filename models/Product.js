import mongoose from "mongoose";
import { CategoryProduct } from "./index.js";

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  photos: {
    type: [String],
    required: true,
    validate: [(val) => val.length <= 8, "Photos up to 8"],
  },
  brand: {
    type: String,
    required: true,
    default: "OEM",
  },
  price: {
    type: Number,
    required: true,
    default: 1,
  },
  sizes: [String],
  colors: [String],
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  sold: {
    type: Number,
    default: 0,
  },
  description: String,
  date: {
    type: Date,
    default: new Date(),
  },
  profit: {
    type: Number,
    default: 0,
  },
});

const ProductModel = mongoose.model("Product", ProductSchema);

class Product {
  constructor() {}
  async create(product) {
    this.model = new ProductModel(product);
    await CategoryProduct.addCategoriesToProduct(
      product.categories,
      this.model._id
    );
    return this.model;
  }
  save() {
    return this.model.save();
  }
  async init(id) {
    this.model = await ProductModel.findById(mongoose.Types.ObjectId(id));
  }
  static async get(filter, page, limit, category) {
    if (category) {
      const categoryProducts = await CategoryProduct.getProductsID(category);
      filter._id = categoryProducts.map((x) => x.product);
    }
    let res = ProductModel.find(filter);
    res = limit ? res.limit(parseInt(limit)) : res;
    res = page ? res.skip(parseInt(page - 1) * parseInt(limit ?? 1)) : res;
    return res.lean();
  }
  static async count(filter, category) {
    if (category) {
      const categoryProducts = await CategoryProduct.getProductsID(category);
      filter._id = categoryProducts.map((x) => x.product);
    }
    let res = ProductModel.find(filter);
    return res.count();
  }

  async order(size, color, quantity) {
    if (this.hasValidItem(size, color, quantity)) {
      this.model.sold += quantity;
      const total = quantity * this.model.price;
      this.model.profit += total;
      await this.model.save();
      return total;
    }
    throw new Error("Invalid order");
  }
  async cancel(quantity, total) {
    this.model.sold -= quantity;
    this.model.profit -= total;
    return await this.model.save();
  }

  hasValidItem(size, color, quantity) {
    return (
      this.model.sizes.includes(size) &&
      this.model.colors.includes(color) &&
      this.model.quantity - this.model.sold >= quantity
    );
  }

  static search(name) {
    console.log(name);
    return ProductModel.find({
      name: { $regex: new RegExp(name, "i") },
    }).lean();
  }

  static getMongooseModel() {
    return ProductModel;
  }
  static getAll() {
    return ProductModel.find().lean();
  }
  static paginate(page, quantity) {
    return ProductModel.find()
      .limit(quantity)
      .skip((page - 1) * quantity);
  }
  static async getMaxPaginate(quantity) {
    const count = await ProductModel.estimatedDocumentCount();
    return Math.ceil(count / quantity);
  }
  static getAllByBrand(brand) {
    return ProductModel.find({ brand }).lean();
  }
  static getById(id) {
    return ProductModel.findById(mongoose.Types.ObjectId(id)).lean();
  }
  static updateById(id, newProduct) {
    return ProductModel.findByIdAndUpdate(
      mongoose.Types.ObjectId(id),
      {
        ...newProduct,
      },
      { new: true }
    );
  }
  static removeById(id) {
    return ProductModel.findByIdAndDelete(mongoose.Types.ObjectId(id));
  }
}

export default Product;
