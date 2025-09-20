import { AppdataSource } from "../config/data-source";
import {Task} from "../entities/task.entity";

export class TaskRepository {
    private repo = AppdataSource.getRepository(Task);

    async create(title: string) {
        const task = this.repo.create ({title});
        return await this.repo.save(task);
    }

    async getAll() {
        return await this.repo.find();
    }
}