import { Router } from "express";
import { TaskController } from "../controllers/task.controller";

const router = Router();
const controller = new TaskController();

router.post("/", controller.create);         // admin crea tarea
router.get("/", controller.getAll);          // ver todas
router.put("/:id/complete", controller.markCompleted); // user marca como completa

export default router;
