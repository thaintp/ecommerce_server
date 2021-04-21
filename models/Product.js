import mongoose from "mongoose";

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
  async init(id) {
    this.model = await ProductModel.findById(mongoose.Types.ObjectId(id));
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

  static getMongooseModel() {
    return ProductModel;
  }
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
    return ProductModel.findByIdAndUpdate(mongoose.Types.ObjectId(id), {
      ...newProduct,
    });
  }
  static removeById(id) {
    return ProductModel.findByIdAndDelete(mongoose.Types.ObjectId(id));
  }
}

export default Product;
