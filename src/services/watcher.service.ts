import { TaskWatcherRepository } from "../repositories/task-watcher.repository";
import { MembershipService } from "./membership.service";
import { UserService } from "./user.service";
import { AppdataSource } from "../config/data-source";
import { Task } from "../entities/task.entity";

export class WatcherService {
  private watcherRepo = new TaskWatcherRepository();
  private membershipService = new MembershipService();
  private userService = new UserService();
  private taskRepo = AppdataSource.getRepository(Task);

  // Límite configurable de watchers por tarea
  private readonly MAX_WATCHERS_PER_TASK = parseInt(process.env.MAX_WATCHERS_PER_TASK || "10");

  async suscribirUsuario(taskId: number, userId: number): Promise<void> {
    // Verificar que la tarea existe usando directamente el repositorio
    const task = await this.taskRepo.findOne({ 
      where: { id: taskId },
      relations: ["team"]
    });
    if (!task) {
      throw new Error("Tarea no encontrada");
    }

    // Verificar que el usuario existe
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Verificar que el usuario es miembro del equipo o es admin
    if (user.rol !== "admin") {
      const membresia = await this.membershipService.obtenerMembresia(task.team.id, userId);
      if (!membresia) {
        throw new Error("Solo los miembros del equipo pueden suscribirse a esta tarea");
      }
    }

    // Verificar que no está ya suscrito
    const existingWatcher = await this.watcherRepo.findOne(taskId, userId);
    if (existingWatcher) {
      throw new Error("El usuario ya está suscrito a esta tarea");
    }

    // Verificar límite de watchers
    const watcherCount = await this.watcherRepo.countByTaskId(taskId);
    if (watcherCount >= this.MAX_WATCHERS_PER_TASK) {
      throw new Error(`Se ha alcanzado el límite máximo de ${this.MAX_WATCHERS_PER_TASK} watchers para esta tarea`);
    }

    // Crear suscripción
    await this.watcherRepo.create(taskId, userId);
  }

  async desuscribirUsuario(taskId: number, userId: number): Promise<void> {
    // Verificar que la tarea existe
    const task = await this.taskRepo.findOne({ where: { id: taskId } });
    if (!task) {
      throw new Error("Tarea no encontrada");
    }

    // Buscar la suscripción
    const watcher = await this.watcherRepo.findOne(taskId, userId);
    if (!watcher) {
      throw new Error("El usuario no está suscrito a esta tarea");
    }

    // Eliminar suscripción
    await this.watcherRepo.remove(watcher);
  }


  async listarWatchersPorTarea(taskId: number, userId: number) {
    // Verificar que la tarea existe
    const task = await this.taskRepo.findOne({ 
      where: { id: taskId },
      relations: ["team"]
    });
    if (!task) {
      throw new Error("Tarea no encontrada");
    }

    // Verificar que el usuario tiene acceso a ver los watchers (miembro del equipo o admin)
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    if (user.rol !== "admin") {
      const membresia = await this.membershipService.obtenerMembresia(task.team.id, userId);
      if (!membresia) {
        throw new Error("No tienes permisos para ver los watchers de esta tarea");
      }
    }

    // Obtener watchers
    const watchers = await this.watcherRepo.findByTaskId(taskId);
    
    return watchers.map(w => ({
      id: w.id,
      userId: w.user.id,
      name: w.user.name,
      email: w.user.email,
      avatar: w.user.name.charAt(0).toUpperCase(), // Primera letra del nombre
      subscribedAt: w.createdAt
    }));
  }

  async obtenerWatchlistUsuario(userId: number) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const watchers = await this.watcherRepo.findByUserId(userId);

    return watchers.map(w => ({
      watcherId: w.id,
      taskId: w.task.id,
      taskTitle: w.task.title,
      taskDescription: w.task.description,
      taskStatus: w.task.estado,
      taskPriority: w.task.priority,
      taskDueDate: w.task.dueDate,
      teamId: w.task.team.id,
      teamName: w.task.team.name,
      assignedTo: {
        id: w.task.user.id,
        name: w.task.user.name
      },
      subscribedAt: w.createdAt,
      lastUpdate: w.updatedAt
    }));
  }

  async obtenerWatchersPorTarea(taskId: number): Promise<number[]> {
    const watchers = await this.watcherRepo.findByTaskId(taskId);
    return watchers.map(w => w.user.id);
  }

  async estaUsuarioSuscrito(taskId: number, userId: number): Promise<boolean> {
    const watcher = await this.watcherRepo.findOne(taskId, userId);
    return !!watcher;
  }
}