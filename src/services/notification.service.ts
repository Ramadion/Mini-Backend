import { TaskWatcherNotificationRepository } from "../repositories/task-watcher-notification.repository";
import { TaskWatcherRepository } from "../repositories/task-watcher.repository";
import { NotificationEventType } from "../entities/task-watcher-notification.entity";

export class NotificationService {
  private notificationRepo = new TaskWatcherNotificationRepository();
  private watcherRepo = new TaskWatcherRepository(); 

  /**
   * Notifica a todos los watchers de una tarea sobre un evento
   */
  async notifyWatchers(
    taskId: number,
    eventType: NotificationEventType,
    triggeredById: number,
    metadata?: any
  ): Promise<void> {
    // Obtener todos los watchers de la tarea directamente del repositorio
    const watchers = await this.watcherRepo.findByTaskId(taskId);
    const watcherUserIds = watchers.map(w => w.user.id);

    // Crear notificación para cada watcher (excepto el que generó el cambio)
    const notifications = watcherUserIds
      .filter(userId => userId !== triggeredById)
      .map(userId => 
        this.notificationRepo.create(userId, taskId, eventType, triggeredById, metadata)
      );

    await Promise.all(notifications);
  }

  /**
   * Obtiene las notificaciones de un usuario
   */
  async obtenerNotificacionesUsuario(
    userId: number,
    unreadOnly: boolean = false,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;
    const [notifications, total] = await this.notificationRepo.findByUserIdPaginated(
      userId,
      skip,
      limit,
      unreadOnly
    );

    return {
      data: notifications.map(n => ({
        id: n.id,
        taskId: n.task.id,
        taskTitle: n.task.title,
        teamName: n.task.team.name,
        eventType: n.eventType,
        triggeredBy: n.triggeredBy ? {
          id: n.triggeredBy.id,
          name: n.triggeredBy.name
        } : null,
        metadata: n.metadata ? JSON.parse(n.metadata) : null,
        createdAt: n.createdAt,
        readAt: n.readAt,
        isRead: !!n.readAt
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Cuenta notificaciones no leídas de un usuario
   */
  async contarNotificacionesNoLeidas(userId: number): Promise<number> {
    return await this.notificationRepo.countUnreadByUserId(userId);
  }

  /**
   * Marca una notificación como leída
   */
  async marcarComoLeida(notificationId: number, userId: number): Promise<void> {
    const notifications = await this.notificationRepo.findByUserId(userId, false);
    const notification = notifications.find(n => n.id === notificationId);

    if (!notification) {
      throw new Error("Notificación no encontrada o no pertenece al usuario");
    }

    if (notification.readAt) {
      throw new Error("La notificación ya fue marcada como leída");
    }

    await this.notificationRepo.markAsRead(notificationId);
  }

  /**
   * Marca todas las notificaciones de un usuario como leídas
   */
  async marcarTodasComoLeidas(userId: number): Promise<void> {
    await this.notificationRepo.markAllAsReadByUserId(userId);
  }

  // Métodos específicos para diferentes tipos de eventos

  async notifyStatusChange(
    taskId: number,
    triggeredById: number,
    oldStatus: string,
    newStatus: string
  ): Promise<void> {
    await this.notifyWatchers(taskId, NotificationEventType.STATUS_CHANGE, triggeredById, {
      oldStatus,
      newStatus
    });
  }

  async notifyPriorityChange(
    taskId: number,
    triggeredById: number,
    oldPriority: string,
    newPriority: string
  ): Promise<void> {
    await this.notifyWatchers(taskId, NotificationEventType.PRIORITY_CHANGE, triggeredById, {
      oldPriority,
      newPriority
    });
  }

  async notifyCommentAdded(
    taskId: number,
    triggeredById: number,
    commentContent: string
  ): Promise<void> {
    await this.notifyWatchers(taskId, NotificationEventType.COMMENT_ADDED, triggeredById, {
      commentPreview: commentContent.substring(0, 100)
    });
  }

  async notifyTaskUpdated(
    taskId: number,
    triggeredById: number,
    changes: string[]
  ): Promise<void> {
    await this.notifyWatchers(taskId, NotificationEventType.TASK_UPDATED, triggeredById, {
      changes
    });
  }

  async notifyDueDateChange(
    taskId: number,
    triggeredById: number,
    oldDueDate: Date | undefined,
    newDueDate: Date | undefined
  ): Promise<void> {
    await this.notifyWatchers(taskId, NotificationEventType.DUE_DATE_CHANGE, triggeredById, {
      oldDueDate: oldDueDate?.toISOString(),
      newDueDate: newDueDate?.toISOString()
    });
  }
}