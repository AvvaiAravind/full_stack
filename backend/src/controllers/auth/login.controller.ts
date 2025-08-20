/**
 * User authentication controller - handles login and JWT token generation
 */

import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../../models/user.model.js";
import { registerSchema } from "./register.controller.js";

type LoginRequest = z.infer<typeof registerSchema>;

/**
 * User login controller.
 *
 * Handles user authentication by validating credentials and generating
 * JWT tokens for authenticated sessions. Returns token for frontend storage.
 *
 * @param req - Express request object with login credentials
 * @param res - Express response object
 * @returns JSON response with JWT token or error message
 */

const loginController = async (
  req: Request<{}, {}, LoginRequest, {}>,
  res: Response
) => {
  try {
    // Validate request body using Zod schema
    const validationResult = registerSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.message,
        message: "Invalid credentials",
      });
    }

    const { username, password } = validationResult.data;

    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        error: "user not found",
        message: "user not found",
      });
    }

    // Verify password using bcrypt
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ error: "Invalid credentials", message: "Invalid credentials" });
    }

    // Ensure JWT secret is configured
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    // Generate JWT token with user data
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        roles: user.roles,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Return success response with token and user data
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        roles: user.roles,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({
        error: "Internal server error",
        message: "Internal server error",
      });
  }
};

export default loginController;
