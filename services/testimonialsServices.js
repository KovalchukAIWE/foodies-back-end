import Testimonial from "../models/Testimonial.js";

export const getAll = () => Testimonial.find().populate("owner", "name");
