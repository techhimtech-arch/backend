const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GIGW UX Audit Backend API',
      version: '1.0.0',
      description: 'Backend service for GIGW-based UX audit of websites',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:4000',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error code'
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            details: {
              type: 'string',
              description: 'Detailed error information (development only)'
            }
          }
        },
        AuditRequest: {
          type: 'object',
          required: ['url'],
          properties: {
            url: {
              type: 'string',
              format: 'uri',
              description: 'Website URL to audit'
            }
          }
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'ok'
            },
            service: {
              type: 'string',
              example: 'gigw-ux-audit-backend'
            }
          }
        },
        LighthouseScores: {
          type: 'object',
          properties: {
            overall: {
              type: 'integer',
              description: 'Overall performance score (0-100)'
            },
            performance: {
              type: 'integer',
              description: 'Performance score (0-100)'
            },
            accessibility: {
              type: 'integer',
              description: 'Accessibility score (0-100)'
            },
            bestPractices: {
              type: 'integer',
              description: 'Best practices score (0-100)'
            },
            seo: {
              type: 'integer',
              description: 'SEO score (0-100)'
            }
          }
        },
        LighthouseMetrics: {
          type: 'object',
          properties: {
            firstContentfulPaint: {
              type: 'number',
              description: 'First Contentful Paint in milliseconds'
            },
            largestContentfulPaint: {
              type: 'number',
              description: 'Largest Contentful Paint in milliseconds'
            },
            cumulativeLayoutShift: {
              type: 'number',
              description: 'Cumulative Layout Shift'
            },
            totalBlockingTime: {
              type: 'number',
              description: 'Total Blocking Time in milliseconds'
            },
            speedIndex: {
              type: 'number',
              description: 'Speed Index in milliseconds'
            }
          }
        },
        LighthouseAudit: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'Audited URL'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Audit timestamp'
            },
            scores: {
              $ref: '#/components/schemas/LighthouseScores'
            },
            metrics: {
              $ref: '#/components/schemas/LighthouseMetrics'
            },
            audits: {
              type: 'object',
              description: 'Detailed audit results'
            },
            opportunities: {
              type: 'array',
              items: {
                type: 'object'
              },
              description: 'Improvement opportunities'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/server.js']
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi
};
