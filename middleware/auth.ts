import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { loadEnv } from "../config/env";
import { JwtUser } from "../types/auth";

const env = loadEnv();

export const auth =
  (options: { optional?: boolean } = {}) =>
  (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
      if (options.optional) return next();
      return res.status(401).json({ message: "Missing Authorization header" });
    }

    const [, token] = header.split(" ");
    if (!token) {
      return res.status(401).json({ message: "Invalid Authorization header" });
    }

    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as JwtUser;
      req.user = payload;
      return next();
    } catch (err) {
      if (options.optional) return next();
      return res.status(401).json({ message: "Invalid token" });
    }
  };
