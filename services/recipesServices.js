import Recipe from "../models/Recipe.js";

export const listRecipes = async (search = {}) => {
  const { filter = {}, fields = "", settings = {} } = search;

  const recipes = await Recipe.find(filter, fields, settings)
    .populate({
      path: "owner",
      select: "name avatar",
    })
    .lean();

  return recipes.map((recipe) => ({
    _id: recipe._id,
    title: recipe.title,
    instructions: recipe.instructions,
    thumb: recipe.thumb,
    ownerName: recipe.owner.name,
    ownerAvatar: recipe.owner.avatar,
    favorite: recipe.favoriteCount > 0,
  }));
};

export const countAllRecipes = (filter) => Recipe.countDocuments(filter);

export const getRecipe = (filter) => Recipe.findOne(filter);

export const getPopularRecipes = async () => {
  return Recipe.find().sort({ favoriteCount: -1 }).limit(4);
};

export const addRecipe = (data) => Recipe.create(data);

export const removeRecipe = (filter) => Recipe.findOneAndDelete(filter);

export const incrementFavoriteCount = async (id) => {
  const recipe = await Recipe.findById(id);
  if (recipe) {
    if (typeof recipe.favoriteCount === "undefined") {
      recipe.favoriteCount = 1;
    } else {
      recipe.favoriteCount += 1;
    }
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
