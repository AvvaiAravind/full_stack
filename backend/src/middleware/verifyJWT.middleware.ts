import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/express";

/**
 * Middleware to verify JWT token from Authorization header.
 * Adds user data to request object if token is valid.
 */
const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access token required" });
  }

  const token = authHeader?.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: "Internal server error" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

export default verifyJWT;
