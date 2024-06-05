import express from "express";
import categoriesControllers from "../controllers/categoriesControllers.js";

const categoriesRouter = express.Router();

categoriesRouter.get("/", categoriesControllers.getAllCategories);

export default categoriesRouter;
