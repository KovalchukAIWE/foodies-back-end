import Joi from "joi";

export const createRecipeSchema = Joi.object({
  title: Joi.string().required(),
  instructions: Joi.string().required(),
  description: Joi.string().required(),
  time: Joi.string().required(),
  ingredients: Joi.array().required(),
});
