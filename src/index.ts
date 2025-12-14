import express from "express";
import { AppdataSource } from "./config/data-source";
import taskRoutes from "./routes/task.routes";
import userRoutes from "./routes/user.routes";
import teamRoutes from "./routes/team.routes";
import estadoRoutes from "./routes/estado.routes";
import etiquetaRoutes from "./routes/etiqueta.routes";
import tareaEtiquetaRoutes from "./routes/tarea-etiqueta.routes";
import authRoutes from "./routes/auth.routes";
import cors from "cors";
import commentRoutes from "./routes/comment.routes";
import watcherRoutes from "./routes/watcher.routes";
import notificationRoutes from "./routes/notification.routes";
import { setupSwagger } from "./config/swagger.setup";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Configurar Swagger 
setupSwagger(app);

AppdataSource.initialize()
  .then(() => {
    console.log("✅ Base de datos conectada");

    app.get("/", (_req, res) => {
      res.json({ 
        message: "API de Gestión de Tareas",
        documentation: "http://localhost:3000/api-docs",
        endpoints: {
          tasks: "/tasks",
          users: "/users", 
          teams: "/teams",
          auth: "/auth",
          comments: "/comments",
          watchers: "/api/tasks/:id/watchers",
          notifications: "/api/notifications"
        }
      });
    });

    // Tus rutas existentes
    app.use("/users", userRoutes);
    app.use("/tasks", taskRoutes);
    app.use("/teams", teamRoutes);
    app.use("/", estadoRoutes);
    app.use("/etiquetas", etiquetaRoutes);
    app.use("/", tareaEtiquetaRoutes);
    app.use("/auth", authRoutes);
    app.use("/", commentRoutes);
    app.use("/api", watcherRoutes);
    app.use("/api", notificationRoutes);

    // Ruta para saludar Swagger
    app.get("/api/hello", (_req, res) => {
      res.json({ message: "API funcionando correctamente" });
    });

    
    // Middleware para rutas no encontradas
    app.use((req, res) => {
      res.status(404).json({ 
        error: "Ruta no encontrada", 
        path: req.originalUrl,
        documentation: "http://localhost:3000/api-docs" 
      });
    });

    app.listen(3000, () => {
      console.log("🚀 Servidor corriendo en http://localhost:3000");
      console.log("📚 Documentación API: http://localhost:3000/api-docs");
    });
  })
  .catch((err) => {
    console.error("❌ Error al conectar con la BD:", err);
  });