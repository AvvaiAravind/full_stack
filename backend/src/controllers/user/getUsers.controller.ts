import { Request, Response } from "express";
import { z } from "zod";
import User from "../../models/user.model";

const getUsersSchema = z.object({
  roles: z.array(z.enum(["super-admin", "admin", "user"])).optional(),
  searchQuery: z.string().optional(),
});

type GetUsersRequestQuery = z.infer<typeof getUsersSchema>;

const getUsers = async (
  req: Request<{}, {}, {}, GetUsersRequestQuery>,
  res: Response
) => {
  try {
    const validationResult = getUsersSchema.safeParse(req.query);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.message,
      });
    }

    const { roles, searchQuery } = validationResult.data;

    const users = await User.find({
      roles: roles ? { $in: roles } : { $in: ["super-admin", "admin", "user"] },
      ...(searchQuery && { username: { $regex: searchQuery, $options: "i" } }),
    })
      .select("-password")
      .lean();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getUsers;
