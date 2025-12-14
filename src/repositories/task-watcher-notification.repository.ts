import { AppdataSource } from "../config/data-source";
import { TaskWatcherNotification, NotificationEventType } from "../entities/task-watcher-notification.entity";
import { IsNull } from "typeorm";

export class TaskWatcherNotificationRepository {
  private repo = AppdataSource.getRepository(TaskWatcherNotification);

  async create(
    userId: number,
    taskId: number,
    eventType: NotificationEventType,
    triggeredById?: number,
    metadata?: any
  ): Promise<TaskWatcherNotification> {
    const notification = this.repo.create({
      user: { id: userId } as any,
      task: { id: taskId } as any,
      eventType,
      triggeredBy: triggeredById ? ({ id: triggeredById } as any) : undefined,
    });
    return await this.repo.save(notification);
  }

  async findByUserId(
    userId: number,
    unreadOnly: boolean = false
  ): Promise<TaskWatcherNotification[]> {
    const where: any = { user: { id: userId } };
    
    if (unreadOnly) {
      where.readAt = IsNull();
    }

    return await this.repo.find({
      where,
      relations: ["task", "task.team", "triggeredBy"],
      order: { createdAt: "DESC" }
    });
  }

  async countUnreadByUserId(userId: number): Promise<number> {
    return await this.repo.count({
      where: { 
        user: { id: userId },
        readAt: IsNull()
      }
    });
  }

  async markAsRead(notificationId: number): Promise<void> {
    await this.repo.update(notificationId, { readAt: new Date() });
  }

  async markAllAsReadByUserId(userId: number): Promise<void> {
    await this.repo.update(
      { user: { id: userId }, readAt: IsNull() },
      { readAt: new Date() }
    );
  }

  async findByUserIdPaginated(
    userId: number,
    skip: number = 0,
    take: number = 20,
    unreadOnly: boolean = false
  ): Promise<[TaskWatcherNotification[], number]> {
    const where: any = { user: { id: userId } };
    
    if (unreadOnly) {
      where.readAt = IsNull();
    }

    return await this.repo.findAndCount({
      where,
      relations: ["task", "task.team", "triggeredBy"],
      order: { createdAt: "DESC" },
      skip,
      take
    });
  }
}