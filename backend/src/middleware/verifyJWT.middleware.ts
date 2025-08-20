/**
 * JWT authentication middleware - verifies tokens and adds user data to request
 */

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/express.js";

/**
 * Middleware to verify JWT token from Authorization header.
 * Adds user data to request object if token is valid.
 */
const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req?.headers?.authorization;

  // Check for Bearer token in Authorization header
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Access token required",
      message: "Access token required",
    });
  }

  const token = authHeader?.split(" ")[1];

  // Validate JWT secret exists
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      error: "Internal server error",
      message: "Internal server error",
    });
  }

  try {
    // Verify and decode JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    // Token is invalid or expired
    return res.status(403).json({
      error: "Invalid or expired token",
      message: "Invalid or expired token",
    });
  }
};

export default verifyJWT;
