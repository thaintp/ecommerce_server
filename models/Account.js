import mongoose from "mongoose";
import Role from "./Role.js";
import md5 from "md5";
import { Order } from "./index.js";

const AccountSchema = mongoose.Schema({
  name: String,
  password: String,
  email: String,
  orders: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Order",
    },
  ],
  cart: {
    type: mongoose.Types.ObjectId,
    ref: "Order",
  },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
  avatar: {
    type: String,
    default: "https://i.loli.net/2021/04/16/BnZIhjMmzTDecEH.jpg",
  },
});

const AccountModel = mongoose.model("Account", AccountSchema);

class Account {
  constructor(name, email, password) {
    this.model = new AccountModel();
    this.model.name = name;
    this.model.email = email;
    this.model.password = password;
  }
  setRoles(roles) {
    this.model.roles = roles;
  }
  static crateNewCartByOldCart = async (oldCart) => {
    const account = await AccountModel.findOne({ cart: oldCart });
    account.orders.push(oldCart);
    const cart = new Order();
    account.cart = cart.getID();
    await cart.save();
    await account.save();
  };
  async save() {
    if (this.model.roles.length === 0) {
      this.model.roles = [await Role.getUserId()];
    }
    if (this.model.cart === undefined) {
      const order = new Order();
      this.model.cart = order.getID();
      await order.save();
    }
    return await this.model.save();
  }
  static order = async (accountID) => {
    const account = await Account.findById(accountID);
    const cart = account.cart;
    const _order = new Order();
    await _order.initByID(cart);
    await _order.pending();

    account.orders.push(cart);

    const order = new Order();
    account.cart = order.getID();
    await order.save();

    await account.save();
    return cart;
  };
  static findByEmail(email) {
    return AccountModel.findOne({ email }).populate("roles");
  }
  static exist = async (email) => {
    const account = await Account.findByEmail(email);
    return account !== null;
  };
  static findById(id) {
    return AccountModel.findById(mongoose.Types.ObjectId(id)).populate("roles");
  }
  static init() {
    AccountModel.estimatedDocumentCount(async (err, count) => {
      if (!err && count === 0) {
        const admin = new AccountModel();
        admin.name = "Designveloper";
        admin.email = "thaintp@droup.co";
        admin.password = md5("designveloper");
        admin.roles = [await Role.getSellerId()];
        admin.save((err) => {
          if (err) {
            console.error(err);
          } else {
            console.log("Added 'seller' to roles collection");
          }
        });
      }
    });
  }
}

export default Account;
