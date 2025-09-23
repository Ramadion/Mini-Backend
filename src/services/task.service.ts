import { Task } from '../entities/task.entity';
import { TaskRepository } from '../repositories/task.repository';
import { UserService} from './user.service';

export class TaskService {
    private taskRepo = new TaskRepository();
    private userService = new UserService();

    async createTask(title:string, userId: number): Promise<Task> {
        if (!title || !title.trim()) throw new Error("El titulo no puede estar vacio");

        const user = await this.userService.findUserById(userId);
        if (!user) throw new Error("El usuario no existe");
        if (user.rol !== "admin") throw new Error("Solo los usuarios con rol 'admin' pueden crear tareas");

        return await this.taskRepo.create(title, user);
    }

    async getAllTasks(): Promise<Task[]> {
        return await this.taskRepo.getAll();
    }

    async markTaskComplete(id:number ): Promise<Task | null> {
        const task = await this.taskRepo.findOneById(id);
        if (!task) throw new Error("La tarea no existe");
        if (task.completed) throw new Error("La tarea ya esta completada");
        return await this.taskRepo.markCompleted(id);
    }
}
