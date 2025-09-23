
import { AppdataSource } from "../config/data-source";
import { Task } from "../entities/task.entity";
import { User } from "../entities/user.entity";

export class TaskRepository {
  private repo = AppdataSource.getRepository(Task);

  async create(title: string, user: User) {
    const task = this.repo.create({ title, completed: false, user });
    return await this.repo.save(task);
  }

  async getAll() {
    return await this.repo.find({ relations: ["user"] });
  }

  async markCompleted(id: number) {
    const task = await this.repo.findOne({ where: { id } });
    if (!task) return null;
    task.completed = true;
    return await this.repo.save(task);
  }

  async findOneById(id: number) {
  return await this.repo.findOne({ where: { id }, relations: ["user"] });
 }
}
