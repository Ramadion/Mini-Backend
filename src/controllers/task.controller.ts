import { Request, Response } from "express";
import { TaskService } from "../services/task.service";

const taskService = new TaskService();

export class TaskController {
  create = async (req: Request, res: Response) => {
    try {
      const { title, userId } = req.body;
      const task = await taskService.createTask(title, Number(userId));
      res.status(201).json(task);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  getAll = async (_req: Request, res: Response) => {
    try {
      const tasks = await taskService.getAllTasks();
      res.json(tasks);
    } catch (err: any) {
      res.status(500).json({ message: "Error al obtener tareas" });
    }
  };

  markCompleted = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const task = await taskService.markTaskComplete(Number(id));
      res.json(task);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };
}
