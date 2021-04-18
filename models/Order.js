import mongoose from "mongoose";
import Item from "./Item.js";

const OrderSchema = mongoose.Schema({
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
  state: {
    type: String,
    enum: ["Planning", "Pending", "Completed", "Canceled"],
    default: "Planning",
  },
  total: {
    type: Number,
    required: true,
    default: 0,
  },
});

const OrderModel = mongoose.model("Order", OrderSchema);

class Order {
  constructor() {
    this.model = new OrderModel();
    this.model.items = [];
    this.model.total = 0;
  }
  async initByID(id) {
    this.model = await OrderModel.findById(id);
  }
  async addItem(_item) {
    const item = new Item();
    await item.init(_item);
    await item.save();
    this.model.items.push(item.getID());
    this.model.total += item.getTotal();
  }
  async pending() {
    this.model.state = "Pending";
    return await this.model.save();
  }
  async save() {
    this.model.save();
  }
  async init(items) {
    for (let _item of items) {
      this.addItem(_item);
    }
    await this.model.save();
  }
  getID() {
    return this.model._id;
  }
  getModel() {
    return this.model;
  }
  async getModelDetail() {
    return await this.model.execPopulate({
      path: "items",
      populate: { path: "product" },
    });
  }
}

export default Order;
