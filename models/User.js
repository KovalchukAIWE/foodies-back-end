import { Schema, model } from "mongoose";

import { handleSaveError, setUpdateSettings } from "./hooks.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    avatar: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    followers: {
      type: [Schema.Types.ObjectId],
      ref: "user",
    },
    following: {
      type: [Schema.Types.ObjectId],
      ref: "user",
    },
    ownRecipes: {
      type: [Schema.Types.ObjectId],
      ref: "recipe",
    },
    favoriteRecipes: {
      type: [Schema.Types.ObjectId],
      ref: "recipe",
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", setUpdateSettings);

userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);

export default User;
