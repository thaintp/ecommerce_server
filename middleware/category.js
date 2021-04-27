import { Category } from "../models/index.js";

import { throwErr } from "../utils/patterns.js";
import mongoose from "mongoose";

async function getCategories(req, res, next) {
  try {
    const query = req.query;
    const filter = {};
    res.categories = await Category.getCategories(filter);
  } catch (err) {
    console.log(err);
    return throwErr(err, res);
  }
  next();
}

async function createCategory(req, res, next) {
  try {
    const category = new Category(req.body.name);
    res.category = await category.save();
  } catch (err) {
    console.log(err);
    return throwErr(err, res);
  }
  next();
}

export { getCategories, createCategory };
