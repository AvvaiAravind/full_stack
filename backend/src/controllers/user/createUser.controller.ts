import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import { z } from "zod";
import User from "../../models/user.model";

const createUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  roles: z.enum(["super-admin", "admin", "user"]),
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

    const { username, password, roles } = validatedBody.data;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      roles,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export default createUser;
