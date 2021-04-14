const mongoose = require("mongoose");
const Role = require("./Role");
const md5 = require("md5");

const AccountSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  orders: [mongoose.Types.ObjectId],
  cart: mongoose.Types.ObjectId,
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
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
  save() {
    this.model.save();
  }
  static findByEmail(email) {
    return AccountModel.findOne({ email }).populate("roles");
  }
  static exist = async (email) => {
    const account = await Account.findByEmail(email);
    return account !== null;
  };
  static findById(id) {
    return AccountModel.findById(id);
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

module.exports = Account;
