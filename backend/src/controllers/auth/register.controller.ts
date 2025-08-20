import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import { z } from "zod";
import User from "../../models/user.model";

/**
 * Zod schema for user registration validation.
 * Ensures email format and minimum password length.
 */
export const registerSchema = z.object({
  username: z.email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(15, "Password must be at most 8 characters"),
});

type RegisterRequest = z.infer<typeof registerSchema>;

/**
 * User registration controller.
 *
 * Handles new user registration with email validation, password hashing,
 * and duplicate user checking. Creates a new user with default "user" role.
 *
 * @param req - Express request object with validated registration data
 * @param res - Express response object
 * @returns JSON response with success/error message
 */

const registerController = async (
  req: Request<{}, {}, RegisterRequest, {}>,
  res: Response
) => {
  try {
    // Validate the request body
    const validationResult = registerSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.message,
      });
    }

    const { username, password } = validationResult.data;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      username,
      password: hashedPassword,
      roles: "user",
    });

    res.status(201).json({
      message: "User created successfully",
      username: newUser.username,
      roles: newUser.roles,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default registerController;
