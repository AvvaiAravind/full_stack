/**
 * User creation controller - creates new users with role-based permissions
 */

import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import { z } from "zod";
import User from "../../models/user.model.js";

// Schema for user creation validation
const createUserSchema = z.object({
  username: z.email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(15, "Password must be at most 15 characters"),
  roles: z.enum(["super-admin", "admin", "user"], {
    message: "Invalid role",
  }),
  native: z.string().min(2, "Native must be at least 2 characters"),
});

type CreateUserBody = z.infer<typeof createUserSchema>;

/**
 * Create user controller.
 *
 * Handles new user creation with validation, password hashing, and duplicate checking.
 * Creates users with specified roles and native language information.
 *
 * @param req - Express request object with user data (username, password, roles, native)
 * @param res - Express response object
 * @returns JSON response with created user data or error message
 */
const createUser = async (
  req: Request<{}, {}, CreateUserBody, {}>,
  res: Response
) => {
  try {
    // Validate request body
    const validatedBody = createUserSchema.safeParse(req.body);

    if (!validatedBody.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validatedBody.error.message,
        message: "Validation failed",
      });
    }

    const { username, password, roles, native } = validatedBody.data;

    // Check for existing user to prevent duplicates
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
        message: "User already exists",
      });
    }

    // Hash password for secure storage
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create new user with provided data
    const user = await User.create({
      username,
      password: hashedPassword,
      roles,
      native,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: "Internal server error",
    });
  }
};

export default createUser;
