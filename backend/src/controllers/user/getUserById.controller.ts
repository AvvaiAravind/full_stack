import { Request, Response } from "express";
import { z } from "zod";
import User from "../../models/user.model.js";

const getUserByIdSchema = z.object({
  _id: z.string(),
});

type GetUserByIdRequest = z.infer<typeof getUserByIdSchema>;

const getUserById = async (
  req: Request<GetUserByIdRequest, {}, {}, {}>,
  res: Response
) => {
  try {
    const validationResult = getUserByIdSchema.safeParse(req.params);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.message,
        message: "Validation failed",
      });
    }

    const { _id } = validationResult.data;

    const user = await User.findById(_id).select("-password");

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

export default getUserById;
