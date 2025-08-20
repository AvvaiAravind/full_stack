import { Request, Response } from "express";
import z from "zod";
import User from "../../models/user.model.js";

const deleteUserByIdSchema = z.object({
  _id: z.string(),
});

type DeleteUserByIdRequest = z.infer<typeof deleteUserByIdSchema>;

const deleteUserById = async (
  req: Request<DeleteUserByIdRequest, {}, {}, {}>,
  res: Response
) => {
  try {
    const validationResult = deleteUserByIdSchema.safeParse(req.params);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.message,
      });
    }

    const { _id } = validationResult.data;

    const user = await User.findByIdAndDelete(_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export default deleteUserById;
