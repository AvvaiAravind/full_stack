/**
 * User listing controller - retrieves users with optional filtering and search
 */

import { Request, Response } from "express";
import { z } from "zod";
import User from "../../models/user.model.js";

// Schema for query parameters validation
const getUsersSchema = z.object({
  roles: z.array(z.enum(["super-admin", "admin", "user"])).optional(),
  searchQuery: z.string().optional(),
});

type GetUsersRequestQuery = z.infer<typeof getUsersSchema>;

/**
 * Get users controller.
 *
 * Handles user listing with optional filtering by roles and search by username.
 * Supports query parameters for role-based filtering and text search.
 *
 * @param req - Express request object with query parameters (roles, searchQuery)
 * @param res - Express response object
 * @returns JSON response with filtered user list or error message
 */
const getUsers = async (
  req: Request<{}, {}, {}, GetUsersRequestQuery>,
  res: Response
) => {
  try {
    // Validate query parameters
    const validationResult = getUsersSchema.safeParse(req.query);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.message,
        message: "Validation failed",
      });
    }

    const { roles, searchQuery } = validationResult.data;

    // Build MongoDB query with filters
    const users = await User.find({
      // Filter by roles if provided, otherwise get all roles
      roles: roles ? { $in: roles } : { $in: ["super-admin", "admin", "user"] },
      // Add username search if searchQuery provided
      ...(searchQuery && { username: { $regex: searchQuery, $options: "i" } }),
    })
      .select("-password") // Exclude password from response
      .lean(); // Return plain JavaScript objects for better performance

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: "Internal server error",
    });
  }
};

export default getUsers;
