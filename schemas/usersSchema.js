import Joi from "joi";

export const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const followSchema = Joi.object({
  id: Joi.string()
    .hex()
    .message("invalid 'id' format")
    .length(24)
    .message("invalid 'id' format")
    .required(),
});
