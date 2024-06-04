import express from "express";
import usersControllers from "../controllers/usersControllers.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import validateBody from "../decorators/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

import { signupSchema, signinSchema } from "../schemas/usersSchema.js";

const usersRouter = express.Router();

usersRouter.post(
  "/signup",
  isEmptyBody,
  validateBody(signupSchema),
  usersControllers.signup
);

usersRouter.post(
  "/signin",
  isEmptyBody,
  validateBody(signinSchema),
  usersControllers.signIn
);

usersRouter.get("/current", authenticate, usersControllers.getCurrent);

usersRouter.post("/signout", authenticate, usersControllers.signOut);

usersRouter.get("/:id", authenticate, usersControllers.getUserById);

usersRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  usersControllers.addAvatar
);

export default usersRouter;
