import mongoose from "mongoose";

const CategorySchema = mongoose.Schema({
  name: String,
});

const CategoryModel = mongoose.model("Category", CategorySchema);

class Category {
  constructor(category) {
    this.model = new CategoryModel();
    this.model.name = category;
  }
  async save() {
    return this.model.save();
  }
  static getCategories = async () => {
    return CategoryModel.find().lean();
  };
}

export default Category;
