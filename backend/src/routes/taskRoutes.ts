import express from "express";
import { getTasks, createTask } from "../controllers/taskController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.get("/", authMiddleware, getTasks);
router.post("/", authMiddleware, createTask);

export default router;
