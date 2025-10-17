import { Router } from "express";
import { TaskController } from "../controllers/task.controller";

const router = Router();
const controller = new TaskController();

router.post("/", controller.create);         // admin crea tarea
router.post("/user", controller.createUserTask); // usuario crea tarea para si mismo
router.get("/:id", controller.getAllTasks);          // ver todas
router.patch("/:id/state", controller.markstate); // cambiar estado tarea
router.delete("/:id", controller.delete);    // admin borra tarea
router.put("/:id", controller.update);       // admin actualiza tarea


export default router;
