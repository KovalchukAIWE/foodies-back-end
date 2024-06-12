import express from "express";
import usersControllers from "../controllers/usersControllers.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import isValidId from "../middlewares/isValidId.js";
import validateBody from "../decorators/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";
import {
  signupSchema,
  signinSchema,
  followSchema,
} from "../schemas/usersSchema.js";

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

usersRouter.get("/followers", authenticate, usersControllers.getUserFollowers);

usersRouter.get(
  "/followings",
  authenticate,
  usersControllers.getUserFollowings
);

usersRouter.get("/:id", authenticate, isValidId, usersControllers.getUserById);

usersRouter.patch(
  "/avatar",
  authenticate,
  upload.single("avatar"),
  usersControllers.addAvatar
);

usersRouter.patch(
  "/:id/follow",
  authenticate,
  isValidId,
  isEmptyBody,
  validateBody(followSchema),
  usersControllers.addToFollowings
);

usersRouter.patch(
  "/:id/unfollow",
  authenticate,
  isValidId,
  isEmptyBody,
  validateBody(followSchema),
  usersControllers.removeFromFollowings
);

export default usersRouter;
