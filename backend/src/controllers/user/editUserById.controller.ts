/**
 * User editing controller - updates user information with partial updates
 */

import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import { z } from "zod";
import User from "../../models/user.model.js";

// Schema for user update validation (all fields optional for PATCH)
const editUserByIdSchema = z.object({
  username: z.string().optional(),
  roles: z.enum(["super-admin", "admin", "user"]).optional(),
  native: z.string().optional(),
  password: z.string().optional(),
});

// Schema for user ID validation
const idSchema = z.object({
  _id: z.string(),
});

type IdSchema = z.infer<typeof idSchema>;
type EditUserByIdBody = z.infer<typeof editUserByIdSchema>;

/**
 * Edit user by ID controller.
 *
 * Handles user information updates with partial data support (PATCH operation).
 * Validates user existence, prevents duplicate usernames, and hashes passwords.
 *
 * @param req - Express request object with user ID in params and update data in body
 * @param res - Express response object
 * @returns JSON response with updated user data or error message
 */
const editUserById = async (
  req: Request<IdSchema, {}, EditUserByIdBody, {}>,
  res: Response
) => {
  try {
    // Validate request body and parameters
    const validatedBody = editUserByIdSchema.safeParse(req.body);
    const validatedId = idSchema.safeParse(req.params);

    if (!validatedBody.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validatedBody.error.message,
        message: "Validation failed",
      });
    }

    if (!validatedId.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validatedId.error.message,
        message: "Validation failed",
      });
    }

    const { _id } = validatedId.data;
    const { username, roles, native, password } = validatedBody.data;

    // Build update object with only provided fields
    const updateData: any = {};

    if (username) {
      // Check for duplicate username (excluding current user)
      const existingUser = await User.findOne({
        username,
        _id: { $ne: _id }, // Not equal to current user
      });

      if (existingUser) {
        return res.status(400).json({
          error: "Username already exists",
          message: "Username already exists",
        });
      }
      updateData.username = username;
    }

    if (roles) {
      updateData.roles = roles;
    }

    if (native) {
      updateData.native = native;
    }

    if (password) {
      // Hash password if provided
      updateData.password = await bcryptjs.hash(password, 10);
    }

    // Update user with only provided fields using $set
    const user = await User.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: "Internal server error",
    });
  }
};

export default editUserById;
