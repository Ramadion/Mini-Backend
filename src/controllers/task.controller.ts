import { Request, Response } from "express";   
import { TaskRepository } from "../repositories/task.repository";

export class TaskController {
    private taskRepo = new TaskRepository();

    create = async (req: Request, res: Response) => {
        const { title } = req.body;
        const task = await this.taskRepo.create(title);
        res.json(task);
    };

    getAll = async (req: Request, res: Response) => {
        const tasks = await this.taskRepo.getAll();
        res.json(tasks);
    }
}