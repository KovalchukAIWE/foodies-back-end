import fs from "fs/promises";
import * as recipesService from "../services/recipesServices.js";
import User from "../models/User.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import cloudinary from "../helpers/cloudinary.js";

const getAllRecipes = async (req, res) => {
  const { category, ingredient, area, page = 1, limit = 20 } = req.query;
  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (ingredient) {
    filter["ingredients.id"] = ingredient;
  }

  if (area) {
    filter.area = area;
  }

  const fields = "-createdAt -updatedAt";
  const skip = (page - 1) * limit;
  const settings = { skip, limit: Number(limit) };
  const total = await recipesService.countAllRecipes(filter);

  const result = await recipesService.listRecipes({
    filter,
    fields,
    settings,
  });

  res.json({
    total,
    page: Number(page),
    limit: Number(limit),
    result,
  });
};

const getRecipeById = async (req, res) => {
  const { id: _id } = req.params;
  const recipe = await recipesService.getRecipe({ _id });
  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }
  res.json(recipe);
};

const getPopularRecipes = async (req, res) => {
  const recipes = await recipesService.getPopularRecipes();
  res.json(recipes);
};

const addRecipe = async (req, res) => {
  const { _id: owner } = req.user;
  const newRecipe = await recipesService.addRecipe({ ...req.body, owner });
  res.status(201).json(newRecipe);
};

const deleteRecipe = async (req, res) => {
  const { _id: owner } = req.user;
  const { id: _id } = req.params;
  const recipes = await recipesService.removeRecipe({ _id, owner });
  if (!recipes) {
    throw HttpError(404, "Recipe not found");
  }

  res.json(recipes);
};

const getMyRecipes = async (req, res) => {
  const { _id: owner } = req.user;
  const filter = { owner };
  const fields = "-createdAt -updatedAt";
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const settings = { skip, limit: Number(limit) };

  const myRecipes = await recipesService.listRecipes({
    filter,
    fields,
    settings,
  });

  res.json({
    myRecipes,
  });
};

const addFavoriteRecipe = async (req, res) => {
  const { _id: owner } = req.user;
  const { id: _id } = req.params;

  const user = await User.findById(owner);
  if (!user.favoriteRecipes.includes(_id)) {
    user.favoriteRecipes.push(_id);
    await user.save();
    await recipesService.incrementFavoriteCount(_id);
  }

  res.json({ message: "Recipe added to favorites" });
};

const removeRecipeFromFavorites = async (req, res) => {
  const { _id: owner } = req.user;
  const { id: _id } = req.params;

  const user = await User.findById(owner);
  if (user.favoriteRecipes.includes(_id)) {
    user.favoriteRecipes = user.favoriteRecipes.filter(
      (favId) => favId.toString() !== _id
    );
    await user.save();
    await recipesService.decrementFavoriteCount(_id);
  }

  res.json({ message: "Recipe removed from favorites" });
};

const getFavoriteRecipes = async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "favoriteRecipes",
    populate: { path: "category ingredients.id area" },
  });
  res.json(user.favoriteRecipes);
};

export default {
  getAllRecipes: ctrlWrapper(getAllRecipes),
  getRecipeById: ctrlWrapper(getRecipeById),
  getPopularRecipes: ctrlWrapper(getPopularRecipes),
  addRecipe: ctrlWrapper(addRecipe),
  deleteRecipe: ctrlWrapper(deleteRecipe),
  getMyRecipes: ctrlWrapper(getMyRecipes),
  addFavoriteRecipe: ctrlWrapper(addFavoriteRecipe),
  removeRecipeFromFavorites: ctrlWrapper(removeRecipeFromFavorites),
  getFavoriteRecipes: ctrlWrapper(getFavoriteRecipes),
};
