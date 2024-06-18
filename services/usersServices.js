import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "../models/User.js";

export const findUser = (filter) => User.findOne(filter);

export const saveUser = async (data) => {
  const hashPassword = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, password: hashPassword });
};

export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);

export const updateUserProperty = (user) => user.save();

export const findMany = (filter = {}, fields = "") => {
  if (filter.ids) {
    return User.find(
      {
        _id: { $in: filter.ids },
      },
      fields
    );
  }
  return User.find(filter, fields);
};

export const getFollowersInfo = (id, page, limit, following) => {
  return User.aggregate([
    {
      $match: { _id: id },
    },
    {
      $project: {
        followers: 1,
        following: 1,
      },
    },
    {
      $unwind: "$followers",
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "users",
        localField: "followers",
        foreignField: "_id",
        as: "followerDetails",
      },
    },
    {
      $unwind: "$followerDetails",
    },
    {
      $lookup: {
        from: "recipes",
        let: { followerId: "$followerDetails._id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$owner", "$$followerId"] } } },
          { $limit: 4 },
          { $project: { thumb: 1, title: 1 } },
        ],
        as: "recipes",
      },
    },
    {
      $lookup: {
        from: "recipes",
        let: { followerId: "$followerDetails._id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$owner", "$$followerId"] } } },
          { $count: "totalRecipes" },
        ],
        as: "totalRecipesCount",
      },
    },
    {
      $addFields: {
        "followerDetails.isFollowing": {
          $in: ["$followerDetails._id", following],
        },
        "followerDetails.recipes": "$recipes",
        "followerDetails.totalRecipes": {
          $arrayElemAt: ["$totalRecipesCount.totalRecipes", 0],
        },
      },
    },
    {
      $group: {
        _id: null,
        followers: {
          $push: {
            _id: "$followerDetails._id",
            name: "$followerDetails.name",
            avatar: "$followerDetails.avatar",
            isFollowing: "$followerDetails.isFollowing",
            totalRecipes: {
              $ifNull: ["$followerDetails.totalRecipes", 0],
            },
            recipes: "$recipes",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        followers: 1,
      },
    },
  ]);
};

export const getFollowingsInfo = (id, page, limit) => {
  return User.aggregate([
    {
      $match: { _id: id },
    },
    {
      $project: {
        following: 1,
      },
    },
    {
      $unwind: "$following",
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "users",
        localField: "following",
        foreignField: "_id",
        as: "followingDetails",
      },
    },
    {
      $unwind: "$followingDetails",
    },
    {
      $lookup: {
        from: "recipes",
        let: { followingId: "$followingDetails._id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$owner", "$$followingId"] } } },
          { $limit: 4 },
          { $project: { thumb: 1, title: 1 } },
        ],
        as: "recipes",
      },
    },
    {
      $lookup: {
        from: "recipes",
        let: { followingId: "$followingDetails._id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$owner", "$$followingId"] } } },
          { $count: "totalRecipes" },
        ],
        as: "totalRecipesCount",
      },
    },
    {
      $addFields: {
        "followingDetails.recipes": "$recipes",
        "followingDetails.totalRecipes": {
          $arrayElemAt: ["$totalRecipesCount.totalRecipes", 0],
        },
      },
    },
    {
      $group: {
        _id: null,
        followings: {
          $push: {
            _id: "$followingDetails._id",
            name: "$followingDetails.name",
            avatar: "$followingDetails.avatar",
            isFollowing: true,
            totalRecipes: {
              $ifNull: ["$followingDetails.totalRecipes", 0],
            },
            recipes: "$recipes",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        followings: 1,
      },
    },
  ]);
};
