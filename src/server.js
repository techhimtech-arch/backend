require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { runAudit } = require('./services/auditRunner');
const lighthouseRoutes = require('./routes/lighthouse');
const { specs, swaggerUi } = require('./config/swagger');
const logger = require('./config/logger');
const errorHandler = require('./middleware/errorHandler');
const { securityMiddleware } = require('./middleware/security');
const { validateAuditRequest } = require('./middleware/validation');

const app = express();

const PORT = process.env.PORT || 4000;

// Security middleware
app.use(...securityMiddleware);

// Basic middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'gigw-ux-audit-backend' });
});

// Swagger docu