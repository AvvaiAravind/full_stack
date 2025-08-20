import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import { z } from "zod";
import User from "../../models/user.model.js";

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

const createUser = async (
  req: Request<{}, {}, CreateUserBody, {}>,
  res: Response
) => {
  try {
    const validatedBody = createUserSchema.safeParse(req.body);

    if (!validatedBody.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validatedBody.error.message,
      });
    }

    const { username, password, roles, native } = validatedBody.data;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      roles,
      native,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export default createUser;
