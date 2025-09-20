
import { Router } from "express";
import { TaskController } from "../controllers/task.controller";

const router = Router();
const controller = new TaskController();

router.post("/", controller.create);
router.get("/", controller.getAll);

export default router;
