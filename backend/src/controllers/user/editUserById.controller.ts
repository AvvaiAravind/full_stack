import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import { z } from "zod";
import User from "../../models/user.model.js";

const editUserByIdSchema = z.object({
  username: z.string().optional(),
  roles: z.enum(["super-admin", "admin", "user"]).optional(),
  native: z.string().optional(),
  password: z.string().optional(),
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

    const updateData: any = {};

    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: _id },
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
      updateData.password = await bcryptjs.hash(password, 10);
    }

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
