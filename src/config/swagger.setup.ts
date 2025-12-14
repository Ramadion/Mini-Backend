import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.config';

export const setupSwagger = (app: Express): void => {
  // Configuración de Swagger UI
  const swaggerUiOptions = {
    explorer: true,
    customSiteTitle: 'API Docs - Gestión de Tareas',
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
      persistAuthorization: true
    }
  };

  // Ruta para la interfaz web de Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

  // Ruta para obtener el JSON de Swagger
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('✅ Swagger UI disponible en: http://localhost:3000/api-docs');
};