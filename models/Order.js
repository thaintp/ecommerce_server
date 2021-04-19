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
  date: {
    type: Date,
    default: new Date(),
  },
});

const OrderModel = mongoose.model("Order", OrderSchema);

class Order {
  constructor() {
    this.model = new OrderModel();
    this.model.items = [];
    this.model.total = 0;
  }
  getState() {
    return this.model.state;
  }
  async updateState(state) {
    this.model.state = state;
  }
  async removeAllItems() {
    this.model.items.map(async (id) => await Item.removeByID(id));
  }
  async initByID(id) {
    this.model = await OrderModel.findById(mongoose.Types.ObjectId(id));
  }
  async addItem(_item) {
    const item = new Item();
    await item.init(_item);
    await item.save();
    this.model.items.push(item.getID());
    this.model.total += item.getTotal();
  }
  async removeItem(id) {
    this.model.items = this.model.items.filter((item) => !item.equals(id));
    this.model.total -= await Item.removeByID(id);
  }
  async pending() {
    this.model.state = "Pending";
    this.model.date = new Date();
    return await this.model.save();
  }
  static getAll() {
    return OrderModel.find()
      .populate({
        path: "items",
        populate: { path: "product" },
      })
      .lean();
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
