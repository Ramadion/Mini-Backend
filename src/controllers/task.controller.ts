import { Request, Response } from "express";
import { TaskRepository } from "../repositories/task.repository";
import { UserRepository } from "../repositories/user.repository";

export class TaskController {
  private taskRepo = new TaskRepository();
  private userRepo = new UserRepository();

  create = async (req: Request, res: Response) => {
    const { title, userId } = req.body;

    const user = await this.userRepo.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    if (user.rol !== "admin") {
      return res.status(403).json({ message: "Solo los administradores pueden crear tareas" });
    }

    const task = await this.taskRepo.create(title, user);
    res.json(task);
  };

  getAll = async (req: Request, res: Response) => {
    const tasks = await this.taskRepo.getAll();
    res.json(tasks);
  };

  markCompleted = async (req: Request, res: Response) => {
    const { id } = req.params;
    const task = await this.taskRepo.markCompleted(Number(id));
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });
    res.json(task);
  };
}
