import mongoose from "mongoose";
import { Product } from "./index.js";

const ItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  color: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const ItemModel = mongoose.model("Item", ItemSchema);

class Item {
  constructor() {
    this.model = new ItemModel();
  }
  async init({ product, color, size, quantity }) {
    this.model.product = product;
    this.model.color = color;
    this.model.size = size;
    this.model.quantity = quantity;
    this.product = new Product();
    await this.product.init(product);
  }
  async save() {
    try {
      this.model.total = await this.product.order(
        this.model.size,
        this.model.color,
        this.model.quantity
      );
      return await this.model.save();
    } catch (err) {
      throw err;
    }
  }
  getID() {
    return this.model._id;
  }
  getTotal() {
    return this.model.total;
  }
}

export default Item;
