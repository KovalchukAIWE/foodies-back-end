import { Schema, model } from "mongoose";

const testimonialSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    testimonial: {
      type: String,
      required: [true, "Testimonial is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

const Testimonial = model("testimonial", testimonialSchema);

export default Testimonial;
