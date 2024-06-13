import bcrypt from "bcrypt";
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
