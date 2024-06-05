import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSettings } from "./hooks.js";

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Set title for recipe"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: [true, "Set category for recipe"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    area: {
      type: Schema.Types.ObjectId,
      ref: "area",
    },
    instructions: {
      type: String,
      required: [true, "Set instructions for recipe"],
    },
    description: {
      type: String,
      required: [true, "Set description for recipe"],
    },
    thumb: {
      type: String,
      default: null,
    },
    time: {
      type: String,
      required: [true, "Set time for recipe"],
    },
    ingredients: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "ingredient",
          required: true,
        },
        measure: {
          type: String,
          required: true,
        },
      },
    ],
    favoriteCount: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false, timestamps: true }
);

recipeSchema.post("save", handleSaveError);

recipeSchema.pre("findOneAndUpdate", setUpdateSettings);

recipeSchema.post("findOneAndUpdate", handleSaveError);

const Recipe = model("recipe", recipeSchema);

export default Recipe;