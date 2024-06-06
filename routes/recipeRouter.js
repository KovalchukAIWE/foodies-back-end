import express from "express";
import recipesController from "../controllers/recipesController.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import validateBody from "../decorators/validateBody.js";
import createRecipeSchema from "../schemas/recipesSchema.js";
import isValidId from "../middlewares/isValidId.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";
import normalizeFields from "../middlewares/normalizeFields.js";

const recipeRouter = express.Router();

recipeRouter.get("/", normalizeFields, recipesController.getAllRecipes);
recipeRouter.get("/:id", isValidId, recipesController.getRecipeById);
recipeRouter.get("/popular", recipesController.getPopularRecipes);

recipeRouter.post(
  "/",
  authenticate,
  isEmptyBody,
  upload.single("thumb"),
  validateBody(createRecipeSchema),
  recipesController.addRecipe
);
recipeRouter.delete(
  "/:id",
  authenticate,
  isValidId,
  recipesController.deleteRecipe
);

recipeRouter.get("/my", authenticate, recipesController.getMyRecipes);

recipeRouter.post(
  "/:id/favorite",
  authenticate,
  recipesController.addFavoriteRecipe
);
recipeRouter.delete(
  "/:id/favorite",
  authenticate,
  isValidId,
  recipesController.removeRecipeFromFavorites
);
recipeRouter.get(
  "/favorites",
  authenticate,
  recipesController.getFavoriteRecipes
);

export default recipeRouter;
