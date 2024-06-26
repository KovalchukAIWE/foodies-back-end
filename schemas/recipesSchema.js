import Joi from "joi";

const recipeIngredientsSchema = Joi.object({
  id: Joi.string().required(),
  measure: Joi.string().required(),
});

const createRecipeSchema = Joi.object({
  title: Joi.string().required(),
  category: Joi.string().required(),
  area: Joi.string(),
  instructions: Joi.string().required(),
  description: Joi.string().required(),
  time: Joi.string().required(),

  ingredients: Joi.array().items(recipeIngredientsSchema),
});

export default createRecipeSchema;
