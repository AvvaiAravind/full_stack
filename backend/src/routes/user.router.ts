/**
 * User management routes - handles CRUD operations with role-based permissions
 */

import express from "express";
import createUser from "../controllers/user/createUser.controller.js";
import deleteUserById from "../controllers/user/deleteUserById.controller.js";
import editUserById from "../controllers/user/editUserById.controller.js";
import getUserById from "../controllers/user/getUserById.controller.js";
import getUsers from "../controllers/user/getUsers.controller.js";
import verifyRoles from "../middleware/verifyRoles.middleware.js";

const router = express.Router();

// Public user operations (requires JWT but no specific roles)
router.get("/", getUsers); // Get all users with optional filtering
router.get("/:_id", getUserById); // Get specific user by ID

// Admin-only operations (requires specific roles)
router.post("/", verifyRoles("super-admin", "admin"), createUser); // Create new user
router.patch("/:_id", verifyRoles("super-admin", "admin"), editUserById); // Update user

// Super-admin only operations
router.delete("/:_id", verifyRoles("super-admin"), deleteUserById); // Delete user

export default router;
