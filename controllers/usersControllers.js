import fs from "fs/promises";
import * as usersService from "../services/usersServices.js";
import * as recipesService from "../services/recipesServices.js";
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

  const { _id: id } = newUser;
  const payload = {
    id,
  };

  const token = createToken(payload);
  await usersService.updateUser({ _id: id }, { token });

  res.status(201).json({
    token,
    user: {
      id: newUser._id,
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
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  });
};

const getCurrent = (req, res) => {
  const { _id: id, name, email } = req.user;
  res.json({
    user: {
      id,
      name,
      email,
      avatar,
    },
  });
};

const signOut = async (req, res) => {
  const { _id } = req.user;
  await usersService.updateUser({ _id }, { token: null });
  res.status(204).json();
};

const getUserById = async (req, res) => {
  const {
    _id: id,
    avatar,
    name,
    email,
    favoriteRecipes,
    followers,
    following,
  } = req.user;
  const { id: requestId } = req.params;

  if (id.toString() === requestId) {
    const ownRecipes = await recipesService.countAllRecipes({ owner: id });

    res.json({
      user: {
        avatar: avatar,
        name: name,
        email: email,
        ownRecipesCount: ownRecipes,
        favoriteRecipesCount: favoriteRecipes.length,
        followersCount: followers.length,
        followingCount: following.length,
      },
    });
  } else {
    const requestUser = await usersService.findUser({ _id: requestId });
    const userRecipes = await recipesService.countAllRecipes({
      owner: requestId,
    });

    res.json({
      user: {
        id: requestUser._id,
        avatar: requestUser.avatar,
        name: requestUser.name,
        email: requestUser.email,
        ownRecipesCount: userRecipes,
        followersCount: requestUser.followers.length,
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

const getUserFollowers = async (req, res) => {
  const userFollowers = [...req.user.followers];
  const filter = { _id: userFollowers };
  const fields = "-token -createdAt -updatedAt -password";

  const userFollowersList = await usersService.findMany(filter, fields);
  res.json(userFollowersList);
};

const getUserFollowings = async (req, res) => {
  const userFollowings = [...req.user.following];
  const filter = { _id: userFollowings };
  const fields = "-token -createdAt -updatedAt -password";

  const userFollowingsList = await usersService.findMany(filter, fields);
  res.json(userFollowingsList);
};

const addToFollowings = async (req, res) => {
  const { _id, following: followList } = req.user;
  const { id } = req.body;

  if (followList.includes(id)) {
    throw HttpError(400, "Following is already exist");
  }
  const userToFollow = await usersService.findUser({ _id: id });

  if (!userToFollow) {
    throw HttpError(404, "Not found");
  }
  followList.push(id);
  const result = await usersService.updateUser(
    { _id },
    { following: followList }
  );
  if (!result) {
    throw HttpError(404, "Not found");
  }

  userToFollow.followers.push(_id);

  const addToFollowers = await usersService.updateUser(
    { _id: id },
    { followers: userToFollow.followers }
  );

  if (!addToFollowers) {
    throw HttpError(404, "Not found");
  }
  res.json({
    follow: {
      id,
      name: userToFollow.name,
      email: userToFollow.email,
    },
  });
};

const removeFromFollowings = async (req, res) => {
  const { _id, following: followList } = req.user;
  const { id } = req.body;

  const followIndex = followList.findIndex((el) => el.toString() === id);

  if (followIndex < 0) {
    throw HttpError(400, "Following not found");
  }
  const userToUnfollow = await usersService.findUser({ _id: id });

  if (!userToUnfollow) {
    throw HttpError(404, "Not found");
  }

  followList.splice(followIndex, 1);

  const result = await usersService.updateUser(
    { _id },
    { following: [...followList] }
  );

  if (!result) {
    throw HttpError(404, "Not found");
  }
  const followerIndex = userToUnfollow.followers.findIndex(
    (el) => el.toString() === _id.toString()
  );

  if (followerIndex < 0) {
    throw HttpError(400, "Follower not found");
  }
  userToUnfollow.followers.splice(followerIndex, 1);

  await usersService.updateUser(
    { _id: id },
    { followers: [...userToUnfollow.followers] }
  );

  res.json({
    unfollow: {
      id,
      name: userToUnfollow.name,
      email: userToUnfollow.email,
    },
  });
};

export default {
  signup: ctrlWrapper(signup),
  signIn: ctrlWrapper(signIn),
  getCurrent: ctrlWrapper(getCurrent),
  signOut: ctrlWrapper(signOut),
  getUserById: ctrlWrapper(getUserById),
  addAvatar: ctrlWrapper(addAvatar),
  getUserFollowers: ctrlWrapper(getUserFollowers),
  getUserFollowings: ctrlWrapper(getUserFollowings),
  addToFollowings: ctrlWrapper(addToFollowings),
  removeFromFollowings: ctrlWrapper(removeFromFollowings),
};
