import { Task, EstadoTarea } from "../entities/task.entity";
import { TaskRepository } from "../repositories/task.repository";
import { UserService } from "./user.service";
import { MembershipService } from "./membership.service";
import { AppdataSource } from "../config/data-source";
import { Team } from "../entities/team.entity";
import { NotificationService } from "./notification.service"; 
import { EstadoService } from "./estado.service";

export class TaskService {
  private taskRepo = new TaskRepository();
  private userService = new UserService();
  private membershipService = new MembershipService();
  private teamRepo = AppdataSource.getRepository(Team);
  private notificationService = new NotificationService(); 

  async createTask(
    title: string, 
    description: string, 
    teamId: number, 
    userId: number, 
    priority: string = 'media',
    dueDate?: string
  ): Promise<Task> {
    if (!title || !title.trim()) throw new Error("El titulo no puede estar vacío");

    const user = await this.userService.findUserById(userId);
    if (!user) throw new Error("El usuario no existe");
    
    const membresia = await this.membershipService.obtenerMembresia(teamId, userId);
    if (!membresia || membresia.rol !== "PROPIETARIO") {
      throw new Error("Solo los propietarios del equipo pueden crear tareas");
    }

    const team = await this.teamRepo.findOneBy({ id: teamId });
    if (!team) throw new Error("El equipo no existe");

    console.log('📄 Service procesando:', { dueDate });

    const task = await this.taskRepo.create(title, description, teamId, userId, priority, dueDate);
    
    if (Array.isArray(task)) {
      throw new Error("Error inesperado: se creó un array de tareas en lugar de una tarea individual");
    }
    
    console.log('✅ Tarea creada en service:', task);

    return task;
  }

  async getAllTasks(userId: number): Promise<Task[]> {
    const user = await this.userService.findUserById(userId);
    if (!user) throw new Error("El usuario no existe");

    if (user.rol === "admin") {
      return await this.taskRepo.getAll();
    }

    const membresias = await this.membershipService.obtenerMembresiasPorUsuario(userId);
    if (membresias.length === 0) {
      throw new Error("El usuario no pertenece a ningún equipo");
    }

    const teamIds = membresias.map(m => m.team.id);
    return await this.taskRepo.getTasksByTeamIds(teamIds);
  }

  async getTasksByEstado(userId: number, estado: EstadoTarea): Promise<Task[]> {
    const user = await this.userService.findUserById(userId);
    if (!user) throw new Error("El usuario no existe");

    if (user.rol === "admin") {
      return await this.taskRepo.getTasksByEstado(estado);
    }

    const membresias = await this.membershipService.obtenerMembresiasPorUsuario(userId);
    if (membresias.length === 0) {
      throw new Error("El usuario no pertenece a ningún equipo");
    }

    const teamIds = membresias.map(m => m.team.id);
    return await this.taskRepo.getTasksByTeamIdsAndEstado(teamIds, estado);
  }

  async deleteTask(taskId: number, actorUserId: number): Promise<void> {
    const task = await this.taskRepo.findOneById(taskId);
    if (!task) throw new Error("La tarea no existe");

    const actor = await this.userService.findUserById(actorUserId);
    if (!actor) throw new Error("El usuario no existe");

    const membresia = await this.membershipService.obtenerMembresia(task.team.id, actorUserId);
    if (!membresia || membresia.rol !== "PROPIETARIO") {
      throw new Error("Solo propietarios del equipo pueden borrar tareas");
    }

    await this.taskRepo.deleteTask(taskId);
  }

  async updateTask(id: number, actorUserId: number, data: { title?: string; description?: string; priority?: string; dueDate?: string }) {
    const task = await this.taskRepo.findOneById(id);
    if (!task) throw new Error("La tarea no existe");

    const actor = await this.userService.findUserById(actorUserId);
    if (!actor) throw new Error("El usuario no existe");
    
    const membresia = await this.membershipService.obtenerMembresia(task.team.id, actorUserId);
    if (!membresia || membresia.rol !== "PROPIETARIO") {
      throw new Error("Solo propietarios del equipo pueden modificar tareas");
    }

    if (task.estado === EstadoTarea.FINALIZADA || task.estado === EstadoTarea.CANCELADA) {
      throw new Error("No se puede modificar una tarea finalizada o cancelada");
    }

    // Detectar cambios para notificar
    const changes: string[] = [];
    let oldPriority: string | undefined;
    let newPriority: string | undefined;
    let oldDueDate: Date | undefined;
    let newDueDate: Date | undefined;

    if (data.title && data.title !== task.title) {
      changes.push("título");
    }
    if (data.description && data.description !== task.description) {
      changes.push("descripción");
    }
    if (data.priority && data.priority !== task.priority) {
      changes.push("prioridad");
      oldPriority = task.priority;
      newPriority = data.priority;
    }
    if (data.dueDate !== undefined) {
      const newDate = data.dueDate ? new Date(data.dueDate) : undefined;
      if (newDate?.getTime() !== task.dueDate?.getTime()) {
        changes.push("fecha de vencimiento");
        oldDueDate = task.dueDate;
        newDueDate = newDate;
      }
    }

    // Preparar data para el repositorio con el tipo correcto
    const updateData: Partial<Task> = {};
    
    if (data.title !== undefined) {
      updateData.title = data.title;
    }
    if (data.description !== undefined) {
      updateData.description = data.description;
    }
    if (data.priority !== undefined) {
      updateData.priority = data.priority;
    }
   
    const updatedTask = await this.taskRepo.updateTask(id, updateData);

    // Notificar a los watchers según los cambios
    try {
      if (oldPriority && newPriority) {
        await this.notificationService.notifyPriorityChange(id, actorUserId, oldPriority, newPriority);
      }
      if (oldDueDate !== undefined || newDueDate !== undefined) {
        await this.notificationService.notifyDueDateChange(id, actorUserId, oldDueDate, newDueDate);
      }
      if (changes.length > 0 && !oldPriority && oldDueDate === undefined) {
        await this.notificationService.notifyTaskUpdated(id, actorUserId, changes);
      }
    } catch (error) {
      console.error("Error al enviar notificaciones de actualización:", error);
    }

    return updatedTask;
  }

  async getTaskById(taskId: number): Promise<Task | null> {
    return await this.taskRepo.findOneById(taskId);
  }

  
async changeState(taskId: number, nuevoEstado: EstadoTarea, userId: number): Promise<Task> {
  
  const estadoService = new EstadoService();
  
  // verificamos permisos 
  const task = await this.taskRepo.findOneById(taskId);
  if (!task) throw new Error("La tarea no existe");

  const actor = await this.userService.findUserById(userId);
  if (!actor) throw new Error("El usuario no existe");
  
  const membresia = await this.membershipService.obtenerMembresia(task.team.id, userId);
  if (!membresia || membresia.rol !== "PROPIETARIO") {
    throw new Error("Solo propietarios del equipo pueden cambiar el estado de las tareas");
  }

  // Delegamos al EstadoService 
  const tareaActualizada = await estadoService.cambiarEstado(taskId, nuevoEstado, userId);

  //  Notificar a los watchers
  try {
    await this.notificationService.notifyStatusChange(
      taskId,
      userId,
      task.estado, // estado anterior (obtenido antes del cambio)
      nuevoEstado
    );
  } catch (error) {
    console.error("Error al enviar notificaciones de cambio de estado:", error);
    // No fallar la operación principal si falla la notificación
  }

  return tareaActualizada;
}
}