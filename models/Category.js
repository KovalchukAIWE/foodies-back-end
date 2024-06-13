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
  },
  { versionKey: false, timestamps: true }
);

const Category = model("category", categorySchema);

export default Category;
