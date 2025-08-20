import express from "express";
import createUser from "../controllers/user/createUser.controller.js";
import deleteUserById from "../controllers/user/deleteUserById.controller.js";
import editUserById from "../controllers/user/editUserById.controller.js";
import getUserById from "../controllers/user/getUserById.controller.js";
import getUsers from "../controllers/user/getUsers.controller.js";
import verifyRoles from "../middleware/verifyRoles.middleware.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/:_id", getUserById);

router.post("/", verifyRoles("super-admin", "admin"), createUser);

router.patch("/:_id", verifyRoles("super-admin", "admin"), editUserById);

router.delete("/:_id", verifyRoles("super-admin"), deleteUserById);

export default router;
