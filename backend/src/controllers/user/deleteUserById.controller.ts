/**
 * User deletion controller - removes users by ID
 */

import { Request, Response } from "express";
import z from "zod";
import User from "../../models/user.model.js";

// Schema for user ID validation
const deleteUserByIdSchema = z.object({
  _id: z.string(),
});

type DeleteUserByIdRequest = z.infer<typeof deleteUserByIdSchema>;

/**
 * Delete user by ID controller.
 *
 * Handles user deletion by ID with validation and existence checking.
 * Permanently removes user from the database.
 *
 * @param req - Express request object with user ID in params
 * @param res - Express response object
 * @returns JSON response with deleted user data or error message
 */
const deleteUserById = async (
  req: Request<DeleteUserByIdRequest, {}, {}, {}>,
  res: Response
) => {
  try {
    // Validate user ID parameter
    const validationResult = deleteUserByIdSchema.safeParse(req.params);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.message,
        message: "Validation failed",
      });
    }

    const { _id } = validationResult.data;

    // Find and delete user by ID
    const user = await User.findByIdAndDelete(_id);

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

export default deleteUserById;
