import { Request, Response } from "express";
import { WatcherService } from "../services/watcher.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export class WatcherController {
  private watcherService = new WatcherService();

  /**
   * POST /api/tasks/:taskId/watchers
   * Suscribir al usuario autenticado a una tarea
   */
  async suscribirse(req: AuthenticatedRequest, res: Response) {
    try {
      const taskId = parseInt(req.params.taskId!);
      const userId = req.user?.id; // Del middleware de auth

      if (!userId) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      if (isNaN(taskId)) {
        return res.status(422).json({ error: "ID de tarea inválido" });
      }

      await this.watcherService.suscribirUsuario(taskId, userId);

      return res.status(201).json({ 
        message: "Suscripción exitosa",
        taskId,
        userId 
      });
    } catch (error: any) {
      console.error("Error al suscribirse:", error);
      
      if (error.message.includes("ya está suscrito")) {
        return res.status(409).json({ error: error.message });
      }
      if (error.message.includes("límite máximo")) {
        return res.status(422).json({ error: error.message });
      }
      if (error.message.includes("no encontrada") || error.message.includes("no existe")) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes("permisos")) {
        return res.status(403).json({ error: error.message });
      }

      return res.status(500).json({ error: "Error al procesar la suscripción" });
    }
  }

   /**
   * DELETE /api/tasks/:taskId/watchers
   * Desuscribir al usuario autenticado de una tarea
   */
  async desuscribirse(req: AuthenticatedRequest, res: Response) {
    try {
      const taskId = parseInt(req.params.taskId!);
      const userId = req.user?.id; // Del middleware de auth - ¡CAMBIO IMPORTANTE!

      if (!userId) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      if (isNaN(taskId)) {
        return res.status(422).json({ error: "ID de tarea inválido" });
      }

      await this.watcherService.desuscribirUsuario(taskId, userId);

      return res.status(204).send();
    } catch (error: any) {
      console.error("Error al desuscribirse:", error);
      
      if (error.message.includes("no está suscrito")) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes("no encontrada")) {
        return res.status(404).json({ error: error.message });
      }

      return res.status(500).json({ error: "Error al procesar la desuscripción" });
    }
  }



  /**
   * GET /api/tasks/:taskId/watchers
   * Listar watchers de una tarea
   */
  async listarWatchers(req: AuthenticatedRequest, res: Response) {
    try {
      const taskId = parseInt(req.params.taskId!);
      const userId = req.user?.id; // Del middleware de auth

      if (!userId) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      if (isNaN(taskId)) {
        return res.status(422).json({ error: "ID de tarea inválido" });
      }

      const watchers = await this.watcherService.listarWatchersPorTarea(taskId, userId);

      return res.status(200).json({
        taskId,
        count: watchers.length,
        watchers
      });
    } catch (error: any) {
      console.error("Error al listar watchers:", error);
      
      if (error.message.includes("no encontrada")) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes("permisos")) {
        return res.status(403).json({ error: error.message });
      }

      return res.status(500).json({ error: "Error al obtener los watchers" });
    }
  }

  /**
   * GET /api/watchers/watchlist
   * Obtener la watchlist del usuario autenticado
   */
  async obtenerWatchlist(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id; // Del middleware de auth

      if (!userId) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      const { teamId, status, page = 1, limit = 20 } = req.query;

      let watchlist = await this.watcherService.obtenerWatchlistUsuario(userId);

      // Aplicar filtros si existen
      if (teamId) {
        watchlist = watchlist.filter(item => item.teamId === parseInt(teamId as string));
      }

      if (status) {
        watchlist = watchlist.filter(item => item.taskStatus === status);
      }

      // Paginación simple
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      const paginatedList = watchlist.slice(startIndex, endIndex);

      return res.status(200).json({
        data: paginatedList,
        total: watchlist.length,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(watchlist.length / limitNum)
      });
    } catch (error: any) {
      console.error("Error al obtener watchlist:", error);
      return res.status(500).json({ error: "Error al obtener la watchlist" });
    }
  }

  /**
   * GET /api/tasks/:taskId/watchers/status
   * Verificar si el usuario está suscrito a una tarea
   */
  async verificarSuscripcion(req: AuthenticatedRequest, res: Response) {
    try {
      const taskId = parseInt(req.params.taskId!);
      const userId = req.user?.id; // Del middleware de auth

      if (!userId) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      if (isNaN(taskId)) {
        return res.status(422).json({ error: "ID de tarea inválido" });
      }

      const isSuscrito = await this.watcherService.estaUsuarioSuscrito(taskId, userId);

      return res.status(200).json({
        taskId,
        userId,
        isWatching: isSuscrito
      });
    } catch (error: any) {
      console.error("Error al verificar suscripción:", error);
      return res.status(500).json({ error: "Error al verificar suscripción" });
    }
  }
}