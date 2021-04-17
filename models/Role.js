import mongoose from "mongoose";

const rolesName = ["user", "seller"];

const RoleSchema = mongoose.Schema({
  name: {
    type: String,
    enum: rolesName,
    default: rolesName[0],
  },
});

const RoleModel = mongoose.model("Role", RoleSchema);

class Role {
  constructor() {}
  static include(roleName) {
    return rolesName.includes(roleName);
  }
  static getUserId = async () => {
    try {
      const role = await RoleModel.findOne({
        name: "user",
      });
      return role._id;
    } catch (err) {}
    return undefined;
  };
  static getSellerId = async () => {
    try {
      const role = await RoleModel.findOne({
        name: "seller",
      });
      return role._id;
    } catch (err) {}
    return undefined;
  };
  static isSellerByIds = async (ids) => {
    try {
      const rolesName = await RoleModel.find({
        _id: { $in: ids },
      });
      for (let roleName of rolesName) {
        if (roleName.name === "seller") {
          return true;
        }
      }
    } catch (err) {}
    return false;
  };
  static getIdsNotSeller = async (names) => {
    try {
      const namesNotSeller = names.filter((x) => x !== "seller");
      const roles = await RoleModel.find({
        name: { $in: namesNotSeller },
      });
      return roles.map((role) => role._id);
    } catch (err) {}
    return [];
  };
  static init() {
    RoleModel.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new RoleModel({
          name: "seller",
        }).save((err) => {
          if (err) {
            console.error(err);
          } else {
            console.log("Added 'seller' to roles collection");
          }
        });

        new RoleModel({
          name: "user",
        }).save((err) => {
          if (err) {
            console.error(err);
          } else {
            console.log("Added 'user' to roles collection");
          }
        });
      }
    });
  }
}

export default Role;
