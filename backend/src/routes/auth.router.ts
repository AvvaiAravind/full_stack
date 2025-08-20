import express from "express";
import loginController from "../controllers/auth/login.controller.js";
import registerController from "../controllers/auth/register.controller.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);

export default router;
