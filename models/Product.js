const mongoose = require("mongoose");

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
  categories: [String],
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
  description: String,
});

const ProductModel = mongoose.model("Product", ProductSchema);

class Product {
  constructor() {}

  static getAll() {
    return ProductModel.find().lean();
  }
  static getAllByBrand(brand) {
    return ProductModel.find({ brand }).lean();
  }
  static getById(id) {
    return ProductModel.findById(mongoose.Types.ObjectId(id)).lean();
  }
  static updateById(id, newProduct) {
    return ProductSchema.findByIdAndUpdate(mongoose.Types.ObjectId(id), {
      ...newProduct,
    });
  }
  static removeById(id) {
    return ProductSchema.findByIdAndDelete(mongoose.Types.ObjectId(id));
  }
}

module.exports = Product;
