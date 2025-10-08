import { Request, Response } from "express";
import { TaskService } from "../services/task.service";
import { UserService } from "../services/user.service";

const taskService = new TaskService();
const userService = new UserService();

export class TaskController {
  create = async (req: Request, res: Response) => {
    try {
      const { title, description, teamId, userId } = req.body;
      const task = await taskService.createTask(title, description, teamId, Number(userId));
      res.status(201).json(task);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.id);
      if(!userId || isNaN(userId)) {
        return res.status(400).json({ message: "userId Invalido" });
      }
      const tasks = await taskService.getAllTasks(userId);
      return res.json(tasks);     
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
      
  };

  markCompleted = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { userId } = req.body;
      const task = await taskService.markTaskComplete(id, Number(userId));
      return res.json(task);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { userId } = req.body;
      await taskService.deleteTask(id, Number(userId));
      return res.status(204).send();
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };


  
update = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { userId, title, description, priority } = req.body;

    const updated = await taskService.updateTask(id, Number(userId), {
      title,
      description,
      priority,
    });

    return res.json(updated);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

}
