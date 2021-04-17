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
    enum: ["Pending", "Completed", "Canceled"],
    default: "Pending",
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
  async init(items) {
    for (let _item of items) {
      const item = new Item();
      await item.init(_item);
      await item.save();
      this.model.items.push(item.getID());
      this.model.total += item.getTotal();
    }
    await this.model.save();
  }
  getID() {
    return this.model._id;
  }
}

export default Order;
