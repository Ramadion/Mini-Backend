// src/index.ts
import express from "express";
import { AppdataSource } from "./config/data-source";
import taskRoutes from "./routes/task.routes";

const app = express();
app.use(express.json());

app.use("/tasks", taskRoutes);

AppdataSource.initialize().then(() => {
  app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
  });
});
