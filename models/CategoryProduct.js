import mongoose from "mongoose";

const CategoryProductSchema = mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});

const CategoryProductModel = mongoose.model(
  "CategoryProduct",
  CategoryProductSchema
);

class CategoryProduct {
  constructor() {}
  static addCategoriesToProduct = (categories, product) => {
    return CategoryProductModel.insertMany(
      categories.map((category) => ({ category, product }))
    );
  };
  static updateCategories = async (categories, product) => {
    await CategoryProductModel.deleteMany({
      product,
    });
    return this.addCategoriesToProduct(categories, product);
  };
  static getProductsID(category) {
    return CategoryProductModel.find({ category });
  }
  async save() {
    return this.model.save();
  }
  static async getMapCategoriesProduct() {
    const data = await CategoryProductModel.find().populate("category").lean();
    const res = {};
    for (let cp of data) {
      if (res[cp.product]) {
        res[cp.product].push(cp.category);
      } else {
        res[cp.product] = [cp.category];
      }
    }
    return res;
  }
}

export default CategoryProduct;
