import { Router } from "express";
import { WatcherController } from "../controllers/watcher.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();
const watcherController = new WatcherController();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

/**
 * @swagger
 * /tasks/{taskId}/watchers:
 *   post:
 *     summary: Suscribirse a una tarea
 *     tags: [Watchers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tarea
 *     responses:
 *       201:
 *         description: Suscripción exitosa
 *       409:
 *         description: El usuario ya está suscrito
 *       422:
 *         description: Límite de watchers alcanzado
 *       403:
 *         description: No tiene permisos
 *       404:
 *         description: Tarea no encontrada
 */
router.post("/tasks/:taskId/watchers", (req, res) => watcherController.suscribirse(req, res));

/**
 * @swagger
 * /tasks/{taskId}/watchers/{userId}:
 *   delete:
 *     summary: Desuscribirse de una tarea
 *     tags: [Watchers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Desuscripción exitosa
 *       403:
 *         description: Solo puedes desuscribirte a ti mismo
 *       404:
 *         description: No está suscrito o tarea no encontrada
 */
router.delete("/tasks/:taskId/watchers", (req, res) => watcherController.desuscribirse(req, res));

/**
 * @swagger
 * /tasks/{taskId}/watchers:
 *   get:
 *     summary: Listar watchers de una tarea
 *     tags: [Watchers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de watchers
 *       403:
 *         description: No tiene permisos
 *       404:
 *         description: Tarea no encontrada
 */
router.get("/tasks/:taskId/watchers", (req, res) => watcherController.listarWatchers(req, res));

/**
 * @swagger
 * /tasks/{taskId}/watchers/status:
 *   get:
 *     summary: Verificar si el usuario está suscrito
 *     tags: [Watchers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estado de suscripción
 */
router.get("/tasks/:taskId/watchers/status", (req, res) => watcherController.verificarSuscripcion(req, res));

/**
 * @swagger
 * /watchers/watchlist:
 *   get:
 *     summary: Obtener watchlist del usuario
 *     tags: [Watchers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: teamId
 *         schema:
 *           type: integer
 *         description: Filtrar por equipo
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filtrar por estado
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
 *         description: Lista de tareas seguidas
 */
router.get("/watchers/watchlist", (req, res) => watcherController.obtenerWatchlist(req, res));

export default router;