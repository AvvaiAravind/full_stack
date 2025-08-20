/**
 * Role-based authorization middleware - checks user permissions for specific operations
 */

import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "../types/express.js";

/**
 * Middleware to verify user has required roles for specific operations.
 * Must be used after verifyJWT middleware.
 */
const verifyRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Ensure user is authenticated (should be set by verifyJWT)
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
        message: "Authentication required",
      });
    }

    const userRoles = (req.user as JwtPayload).roles;

    // Check if user has any roles assigned
    if (!userRoles) {
      return res.status(403).json({
        error: "No roles assigned",
        message: "No roles assigned",
      });
    }

    // Verify user has one of the required roles
    const hasRole = allowedRoles.includes(userRoles);

    if (!hasRole) {
      return res.status(403).json({
        error: "Insufficient permissions",
        required: allowedRoles,
        current: userRoles,
        message: `Insufficient permissions - ${userRoles}`,
      });
    }

    next();
  };
};

export default verifyRoles;
