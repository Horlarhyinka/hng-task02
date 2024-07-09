import { Router } from "express";
import { getUser, login, register } from "../controllers/auth";
import { authMiddleware } from "../middlewares/auth";

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.get("/user/:id", authMiddleware, getUser)


export default router