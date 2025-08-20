import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "../types/express.js";

/**
 * Middleware to verify user has required roles for specific operations.
 * Must be used after verifyJWT middleware.
 */
const verifyRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userRoles = (req.user as JwtPayload).roles;

    if (!userRoles) {
      return res.status(403).json({ error: "No roles assigned" });
    }

    // Check if user has any of the allowed roles
    const hasRole = allowedRoles.includes(userRoles);

    if (!hasRole) {
      return res.status(403).json({
        error: "Insufficient permissions",
        required: allowedRoles,
        current: userRoles,
      });
    }

    next();
  };
};

export default verifyRoles;
