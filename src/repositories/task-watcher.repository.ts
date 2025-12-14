import { AppdataSource } from "../config/data-source";
import { TaskWatcher } from "../entities/task-watcher.entity";

export class TaskWatcherRepository {
  private repo = AppdataSource.getRepository(TaskWatcher);

  async create(taskId: number, userId: number): Promise<TaskWatcher> {
    const watcher = this.repo.create({
      task: { id: taskId } as any,
      user: { id: userId } as any
    });
    return await this.repo.save(watcher);
  }

  async findByTaskId(taskId: number): Promise<TaskWatcher[]> {
    return await this.repo.find({
      where: { task: { id: taskId } },
      relations: ["user"],
      order: { createdAt: "ASC" }
    });
  }

  async findByUserId(userId: number): Promise<TaskWatcher[]> {
    return await this.repo.find({
      where: { user: { id: userId } },
      relations: ["task", "task.team", "task.user"],
      order: { updatedAt: "DESC" }
    });
  }

  async findOne(taskId: number, userId: number): Promise<TaskWatcher | null> {
    return await this.repo.findOne({
      where: { 
        task: { id: taskId },
        user: { id: userId }
      }
    });
  }

  async countByTaskId(taskId: number): Promise<number> {
    return await this.repo.count({
      where: { task: { id: taskId } }
    });
  }

  async remove(watcher: TaskWatcher): Promise<void> {
    await this.repo.remove(watcher);
  }

  async findByTaskIdPaginated(
    taskId: number,
    skip: number = 0,
    take: number = 10
  ): Promise<[TaskWatcher[], number]> {
    return await this.repo.findAndCount({
      where: { task: { id: taskId } },
      relations: ["user"],
      order: { createdAt: "ASC" },
      skip,
      take
    });
  }
}