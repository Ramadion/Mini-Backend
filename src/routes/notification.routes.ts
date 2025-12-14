import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth.middleware";
import { Response } from "express";

const router = Router();
const notificationController = new NotificationController();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

/**
 * @swagger
 * /api/notifications/unread-count:
 *   get:
 *     summary: Contar notificaciones no leídas
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contador de notificaciones no leídas
 */
// IMPORTANTE: Esta ruta debe ir ANTES de /notifications/:notificationId
router.get("/notifications/unread-count", (req: AuthenticatedRequest, res: Response) => {
  return notificationController.contarNoLeidas(req, res);
});

/**
 * @swagger
 * /api/notifications/read-all:
 *   patch:
 *     summary: Marcar todas las notificaciones como leídas
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Todas las notificaciones marcadas como leídas
 */
// IMPORTANTE: Esta ruta debe ir ANTES de /notifications/:notificationId
router.patch("/notifications/read-all", (req: AuthenticatedRequest, res: Response) => {
  return notificationController.marcarTodasComoLeidas(req, res);
});

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Obtener notificaciones del usuario
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: unreadOnly
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Solo notificaciones no leídas
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 *       422:
 *         description: Parámetros inválidos
 */
router.get("/notifications", (req: AuthenticatedRequest, res: Response) => {
  return notificationController.obtenerNotificaciones(req, res);
});

/**
 * @swagger
 * /api/notifications/{notificationId}/read:
 *   patch:
 *     summary: Marcar notificación como leída
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Notificación marcada como leída
 *       404:
 *         description: Notificación no encontrada
 *       409:
 *         description: Ya fue marcada como leída
 */
router.patch("/notifications/:notificationId/read", (req: AuthenticatedRequest, res: Response) => {
  return notificationController.marcarComoLeida(req, res);
});

export default router;