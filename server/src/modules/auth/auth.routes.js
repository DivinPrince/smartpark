import { Router } from "express";
import { authService } from "./auth.module.js";

const router = Router();

// Removed public registration route
router.post("/login", authService.login);

export default router;
