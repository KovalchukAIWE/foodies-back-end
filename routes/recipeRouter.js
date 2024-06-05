import express from "express";
import recipesController from "../controllers/recipesController.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import validateBody from "../decorators/validateBody.js";
import createRecipeSchema from "../schemas/recipesSchema.js";
import isValidId from "../middlewares/isValidId.js";
import authenticate from "../middlewares/authenticate.js";

const recipeRouter = express.Router();

recipeRouter.get("/", recipesController.getAllRecipes);
recipeRouter.get("/:id", isValidId, recipesController.getRecipeById);
recipeRouter.get("/popular", recipesController.getPopularRecipes);

recipeRouter.post(
  "/",
  authenticate,
  isEmptyBody,
  validateBody(createRecipeSchema),
  recipesController.addRecipe
);
recipeRouter.delete(
  "/:id",
  authenticate,
  isValidId,
  recipesController.deleteRecipe
);

recipeRouter.get(
  "/my",
  authenticate,
  isValidId,
  recipesController.getMyRecipes
);

recipeRouter.post(
  "/:id/favorite",
  authenticate,
  isValidId,
  recipesController.addFavoriteRecipe
);
recipeRouter.delete(
  "/:id/favorite",
  authenticate,
  isValidId,
  recipesController.getFavoriteRecipes
);
recipeRouter.get(
  "/favorites",
  authenticate,
  isValidId,
  recipesController.getFavoriteRecipes
);

export default recipeRouter;
