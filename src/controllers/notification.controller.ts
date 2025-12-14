import { Response } from "express";
import { NotificationService } from "../services/notification.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export class NotificationController {
  private notificationService = new NotificationService();

  /**
   * GET /api/notifications
   * Obtener notificaciones del usuario autenticado
   */
  async obtenerNotificaciones(req: AuthenticatedRequest, res: Response) {
    try {
      console.log('🔍 DEBUG req.user:', req.user); 
      
      const userId = req.user?.id;

      if (!userId) {
        console.error('❌ userId es undefined. req.user:', req.user);
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      const { unreadOnly = 'false', page = '1', limit = '20' } = req.query;

      const unread = unreadOnly === 'true';
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);

      if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
        return res.status(422).json({ error: "Parámetros de paginación inválidos" });
      }

      const result = await this.notificationService.obtenerNotificacionesUsuario(
        userId,
        unread,
        pageNum,
        limitNum
      );

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Error al obtener notificaciones:", error);
      return res.status(500).json({ error: "Error al obtener notificaciones" });
    }
  }

  /**
   * GET /api/notifications/unread-count
   * Contar notificaciones no leídas
   */
  async contarNoLeidas(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      const count = await this.notificationService.contarNotificacionesNoLeidas(userId);

      return res.status(200).json({ 
        userId,
        unreadCount: count 
      });
    } catch (error: any) {
      console.error("Error al contar notificaciones no leídas:", error);
      return res.status(500).json({ error: "Error al contar notificaciones" });
    }
  }

  /**
   * PATCH /api/notifications/:notificationId/read
   * Marcar una notificación como leída
   */
  async marcarComoLeida(req: AuthenticatedRequest, res: Response) {
    try {
      const notificationId = parseInt(req.params.notificationId!);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      if (isNaN(notificationId)) {
        return res.status(422).json({ error: "ID de notificación inválido" });
      }

      await this.notificationService.marcarComoLeida(notificationId, userId);

      return res.status(204).send();
    } catch (error: any) {
      console.error("Error al marcar notificación como leída:", error);
      
      if (error.message.includes("no encontrada") || error.message.includes("no pertenece")) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes("ya fue marcada")) {
        return res.status(409).json({ error: error.message });
      }

      return res.status(500).json({ error: "Error al marcar notificación como leída" });
    }
  }

  /**
   * PATCH /api/notifications/read-all
   * Marcar todas las notificaciones como leídas
   */
  async marcarTodasComoLeidas(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      await this.notificationService.marcarTodasComoLeidas(userId);

      return res.status(204).send();
    } catch (error: any) {
      console.error("Error al marcar todas las notificaciones como leídas:", error);
      return res.status(500).json({ error: "Error al marcar todas las notificaciones como leídas" });
    }
  }
}