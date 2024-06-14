import Recipe from "../models/Recipe.js";
import User from "../models/User.js";
import Ingredient from "../models/Ingredient.js";
import { verifyToken } from "../helpers/jwt.js";
import mongoose from "mongoose";

export const listRecipes = async (search = {}, authorization = null) => {
  const { filter = {}, fields = "", settings = {} } = search;

  const recipes = await Recipe.find(filter, fields, settings)
    .populate({
      path: "owner",
      select: "name avatar",
    })
    .lean();

  if (authorization) {
    const [bearer, token] = authorization.split(" ");
    try {
      const { id } = verifyToken(token);
      const user = await User.findById(id).lean();
      const favoriteRecipesSet = new Set(
        user.favoriteRecipes.map((fav) => fav.toString())
      );

      return recipes.map((recipe) => ({
        _id: recipe._id,
        title: recipe.title,
        instructions: recipe.instructions,
        thumb: recipe.thumb,
        ownerName: recipe.owner.name,
        ownerAvatar: recipe.owner.avatar,
        favorite: favoriteRecipesSet.has(recipe._id.toString()),
      }));
    } catch (error) {
      return recipes.map((recipe) => ({
        _id: recipe._id,
        title: recipe.title,
        instructions: recipe.instructions,
        thumb: recipe.thumb,
        ownerName: recipe.owner.name,
        ownerAvatar: recipe.owner.avatar,
        favorite: false,
      }));
    }
  } else {
    return recipes.map((recipe) => ({
      _id: recipe._id,
      title: recipe.title,
      instructions: recipe.instructions,
      thumb: recipe.thumb,
      ownerName: recipe.owner.name,
      ownerAvatar: recipe.owner.avatar,
      favorite: false,
    }));
  }
};

export const countAllRecipes = (filter) => Recipe.countDocuments(filter);

export const getRecipe = async (filter, authorization = null) => {
  const recipeId = filter._id;

  const pipeline = [
    { $match: { _id: new mongoose.Types.ObjectId(recipeId) } },
    {
      $lookup: {
        from: "ingredients",
        localField: "ingredients.id",
        foreignField: "_id",
        as: "ingredients",
      },
    },
    {
      $addFields: {
        ingredients: {
          $map: {
            input: "$ingredients",
            as: "ingredient",
            in: {
              _id: "$$ingredient._id",
              name: "$$ingredient.name",
              desc: "$$ingredient.desc",
              img: "$$ingredient.img",
              measure: {
                $arrayElemAt: [
                  "$ingredients.measure",
                  { $indexOfArray: ["$ingredients.id", "$$ingredient._id"] },
                ],
              },
            },
          },
        },
      },
    },
  ];

  let recipe = await Recipe.aggregate(pipeline).exec();
  recipe = recipe[0];

  if (!recipe) {
    return null;
  }

  recipe = await Recipe.populate(recipe, {
    path: "owner",
    select: "name avatar",
  });

  if (authorization) {
    const [bearer, token] = authorization.split(" ");
    try {
      const { id } = verifyToken(token);
      const user = await User.findById(id).lean();
      const isFavorite = user.favoriteRecipes.some(
        (fav) => fav.toString() === recipe._id.toString()
      );

      return {
        ...recipe,
        ownerName: recipe.owner.name,
        ownerAvatar: recipe.owner.avatar,
        favorite: isFavorite,
      };
    } catch (error) {
      return {
        ...recipe,
        ownerName: recipe.owner.name,
        ownerAvatar: recipe.owner.avatar,
        favorite: false,
      };
    }
  } else {
    return {
      ...recipe,
      ownerName: recipe.owner.name,
      ownerAvatar: recipe.owner.avatar,
      favorite: false,
    };
  }
};

export const getPopularRecipes = async (authorization = null) => {
  const recipes = await Recipe.find()
    .sort({ favoriteCount: -1 })
    .limit(4)
    .populate({
      path: "owner",
      select: "name avatar",
    })
    .lean();

  if (authorization) {
    const [bearer, token] = authorization.split(" ");
    try {
      const { id } = verifyToken(token);
      const user = await User.findById(id).lean();
      const favoriteRecipesSet = new Set(
        user.favoriteRecipes.map((fav) => fav.toString())
      );

      return recipes.map((recipe) => ({
        _id: recipe._id,
        thumb: recipe.thumb,
        title: recipe.title,
        instructions: recipe.instructions,
        favorite: favoriteRecipesSet.has(recipe._id.toString()),
        ownerName: recipe.owner.name,
        ownerAvatar: recipe.owner.avatar,
      }));
    } catch (error) {
      return recipes.map((recipe) => ({
        _id: recipe._id,
        thumb: recipe.thumb,
        title: recipe.title,
        instructions: recipe.instructions,
        favorite: false,
        ownerName: recipe.owner.name,
        ownerAvatar: recipe.owner.avatar,
      }));
    }
  } else {
    return recipes.map((recipe) => ({
      _id: recipe._id,
      thumb: recipe.thumb,
      title: recipe.title,
      instructions: recipe.instructions,
      favorite: false,
      ownerName: recipe.owner.name,
      ownerAvatar: recipe.owner.avatar,
    }));
  }
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

export const getMyRecipesService = async (filter, fields, settings) => {
  const recipes = await Recipe.find(filter, fields, settings).lean();

  return recipes.map((recipe) => ({
    _id: recipe._id,
    thumb: recipe.thumb,
    title: recipe.title,
    instructions: recipe.instructions,
  }));
};
