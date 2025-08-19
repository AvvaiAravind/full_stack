import { Request, Response } from "express";
import { z } from "zod";
import User from "../../models/user.model";

const editUserByIdSchema = z.object({
  username: z.string(),
  roles: z.enum(["super-admin", "admin", "user"]),
});

const idSchema = z.object({
  _id: z.string(),
});

type IdSchema = z.infer<typeof idSchema>;

type EditUserByIdBody = z.infer<typeof editUserByIdSchema>;

const editUserById = async (
  req: Request<IdSchema, {}, EditUserByIdBody, {}>,
  res: Response
) => {
  try {
    const validatedBody = editUserByIdSchema.safeParse(req.body);
    const validatedId = idSchema.safeParse(req.params);

    if (!validatedBody.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validatedBody.error.message,
      });
    }

    if (!validatedId.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validatedId.error.message,
      });
    }

    const { _id } = validatedId.data;
    const { username, roles } = validatedBody.data;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = await User.findByIdAndUpdate(
      _id,
      { username, roles },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export default editUserById;
