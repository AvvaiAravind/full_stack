/**
 * Authentication routes - handles user registration and login
 */

import express from "express";
import loginController from "../controllers/auth/login.controller.js";
import registerController from "../controllers/auth/register.controller.js";

const router = express.Router();

// Public authentication endpoints (no JWT required)
router.post("/register", registerController); // Create new user account
router.post("/login", loginController); // Authenticate user and get JWT token

export default router;
