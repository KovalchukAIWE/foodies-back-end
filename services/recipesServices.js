import Recipe from "../models/Recipe.js";

export const listRecipes = (search = {}) => {
  const { filter = {}, fields = "", settings = {} } = search;
  return Recipe.find(filter, fields, settings)
    .populate("area", "name")
    .populate("ingredients.id", "name")
    .populate("category", "name");
};

export const countAllRecipes = (filter) => Recipe.countDocuments(filter);

export const getRecipe = (filter) =>
  Recipe.findOne(filter)
    .populate("area", "name")
    .populate("ingredients.id", "name")
    .populate("category", "name");

export const getPopularRecipes = async () => {
  return Recipe.find().sort({ favoriteCount: -1 }).limit(4);
};

export const addRecipe = (data) => Recipe.create(data);

export const removeRecipe = (filter) => Recipe.findOneAndDelete(filter);

export const incrementFavoriteCount = async (id) => {
  const recipe = await Recipe.findById(id);
  if (recipe) {
    recipe.favoriteCount += 1;
    await recipe.save();
  }
  return recipe;
};

export const decrementFavoriteCount = async (id) => {
  const recipe = await Recipe.findById(id);
  if (recipe) {
    recipe.favoriteCount -= 1;
    await recipe.save();
  }
  return recipe;
};
