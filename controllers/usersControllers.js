import fs from "fs/promises";
import * as usersService from "../services/usersServices.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import compareHash from "../helpers/compareHash.js";
import { createToken } from "../helpers/jwt.js";
import cloudinary from "../helpers/cloudinary.js";

const signup = async (req, res) => {
  const { email } = req.body;
  const user = await usersService.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const newUser = await usersService.saveUser({ ...req.body });

  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
    },
  });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await usersService.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const comparePassword = await compareHash(password, user.password);
  if (!comparePassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id: id } = user;
  const payload = {
    id,
  };

  const token = createToken(payload);
  await usersService.updateUser({ _id: id }, { token });

  res.json({
    token,
    user: {
      name: user.name,
      email: user.email,
    },
  });
};

const getCurrent = (req, res) => {
  const { name, email } = req.user;
  res.json({
    name,
    email,
  });
};

const signOut = async (req, res) => {
  const { _id } = req.user;
  await usersService.updateUser({ _id }, { token: null });
  res.status(204).json();
};

const getUserById = async (req, res) => {
  const user = req.user;
  const { id: requestId } = req.params;

  if (user._id === requestId) {
    res.json({
      user: {
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        ownRecipesCount: user.ownRecipes.length,
        favoriteRecipesCount: user.favoriteRecipes.length,
        followersCount: user.followers.length,
        followingCount: user.following.length,
      },
    });
  } else {
    const requestUser = await usersService.findUser({ _id: requestId });

    res.json({
      user: {
        id: requestUser._id,
        avatar: requestUser.avatar,
        name: requestUser.name,
        email: requestUser.email,
        ownRecipesCount: requestUser.ownRecipes.length,
        followersCount: user.followers.length,
      },
    });
  }
};

const addAvatar = async (req, res) => {
  const { _id } = req.user;
  if (!req.file) {
    throw HttpError(400, "File not upload");
  }
  try {
    const { url: avatarUrl } = await cloudinary.uploader.upload(req.file.path, {
      folder: "foodies_avatars",
    });

    await usersService.updateUser({ _id }, { avatar: avatarUrl });

    res.json({
      avatar: avatarUrl,
    });
  } catch (error) {
    throw HttpError(400, error.message);
  } finally {
    await fs.unlink(req.file.path);
  }
};

export default {
  signup: ctrlWrapper(signup),
  signIn: ctrlWrapper(signIn),
  getCurrent: ctrlWrapper(getCurrent),
  signOut: ctrlWrapper(signOut),
  getUserById: ctrlWrapper(getUserById),
  addAvatar: ctrlWrapper(addAvatar),
};
