import express from "express";
import loginController from "../controllers/auth/login.controller";
import registerController from "../controllers/auth/register.controller";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);

export default router;
