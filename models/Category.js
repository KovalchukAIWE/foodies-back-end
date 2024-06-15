import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    image: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

const Category = model("category", categorySchema);

export default Category;
