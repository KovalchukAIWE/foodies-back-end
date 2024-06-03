import jwt from "jsonwebtoken";
import "dotenv/config";

const { JWT_SECRET } = process.env;

export const createToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "22h" });

export const verifyToken = (token) => jwt.verify(token, JWT_SECRET);
