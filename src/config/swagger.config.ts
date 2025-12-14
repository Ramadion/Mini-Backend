import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Tareas',
      version: '1.0.0',
      description: 'API completa para gestión de tareas con seguimiento y sistema de notificaciones',
      contact: {
        name: 'Soporte API',
        email: 'soporte@tusistema.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT en formato: Bearer <tu_token>'
        }
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje de error'
            }
          }
        },
        Watcher: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            userId: {
              type: 'integer'
            },
            name: {
              type: 'string'
            },
            email: {
              type: 'string',
              format: 'email'
            },
            avatar: {
              type: 'string'
            },
            subscribedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Notification: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            taskId: {
              type: 'integer'
            },
            taskTitle: {
              type: 'string'
            },
            teamName: {
              type: 'string'
            },
            eventType: {
              type: 'string',
              enum: ['STATUS_CHANGE', 'PRIORITY_CHANGE', 'COMMENT_ADDED', 'TASK_UPDATED', 'DUE_DATE_CHANGE']
            },
            triggeredBy: {
              type: 'object',
              nullable: true,
              properties: {
                id: {
                  type: 'integer'
                },
                name: {
                  type: 'string'
                }
              }
            },
            metadata: {
              type: 'object',
              nullable: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            readAt: {
              type: 'string',
              format: 'date-time',
              nullable: true
            },
            isRead: {
              type: 'boolean'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Autenticación y autorización'
      },
      {
        name: 'Tasks',
        description: 'Gestión de tareas'
      },
      {
        name: 'Watchers',
        description: 'Seguimiento de tareas'
      },
      {
        name: 'Notifications',
        description: 'Sistema de notificaciones'
      },
      {
        name: 'Comments',
        description: 'Comentarios en tareas'
      },
      {
        name: 'Teams',
        description: 'Gestión de equipos'
      }
    ]
  },
  apis: [
    path.resolve(__dirname, '../routes/*.ts'),
    path.resolve(__dirname, '../routes/*.js')
  ]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;