import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../../models/user.model";
import { registerSchema } from "./register.controller";

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
    // Validate request body
    const validationResult = registerSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.message,
      });
    }

    const { username, password } = validationResult.data;

    // Check if user exists
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check JWT secret exists
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    // Generate JWT token
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
    res.status(500).json({ error: "Internal server error" });
  }
};

export default loginController;
