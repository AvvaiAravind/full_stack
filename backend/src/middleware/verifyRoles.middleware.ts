/**
 * Role-based authorization middleware - checks user permissions for specific operations
 */

import { NextFunction, Request, Response } from "express";
import User from "../models/user.model.js";

/**
 * Middleware to verify user has required roles for specific operations.
 * Must be used after verifyJWT middleware.
 */
const verifyRoles = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Ensure user is authenticated (should be set by verifyJWT)
    if (!req.user?.userId) {
      return res.status(401).json({
        error: "Authentication required",
        message: "Authentication required",
      });
    }

    // ✅ Check current role from database instead of JWT
    const currentUser = await User.findById(req.user.userId);

    if (!currentUser) {
      return res.status(401).json({
        error: "User not found",
        message: "User not found",
      });
    }

    // Verify user has one of the required roles
    const hasRole = allowedRoles.includes(currentUser.roles);

    if (!hasRole) {
      return res.status(403).json({
        error: "Insufficient permissions",
        required: allowedRoles,
        current: currentUser.roles,
        message: `Insufficient permissions - ${currentUser.roles}`,
      });
    }

    next();
  };
};

export default verifyRoles;
