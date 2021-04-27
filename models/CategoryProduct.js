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
  static getProductsID(category) {
    return CategoryProductModel.find({ category });
  }
  async save() {
    return this.model.save();
  }
}

export default CategoryProduct;
