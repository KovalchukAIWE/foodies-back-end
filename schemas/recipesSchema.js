import Joi from "joi";

const createRecipeSchema = Joi.object({
  title: Joi.string().required(),
  instructions: Joi.string().required(),
  description: Joi.string().required(),
  time: Joi.string().required(),
  ingredients: Joi.array().required(),
});

export default createRecipeSchema;
