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

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'GIGW UX Audit API Documentation'
}));

// Lighthouse routes
app.use('/api/lighthouse', lighthouseRoutes);

/**
 * @swagger
 * /api/audit:
 *   post:
 *     summary: Run complete UX audit
 *     tags: [Audit]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuditRequest'
 *     responses:
 *       200:
 *         description: Audit completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LighthouseAudit'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/api/audit', validateAuditRequest, async (req, res) => {
  const { url } = req.body;

  try {
    logger.info(`Starting audit for URL: ${url}`);
    const result = await runAudit(url);
    logger.info(`Audit completed for URL: ${url}`);
    res.json(result);
  } catch (err) {
    logger.error(`Audit failed for URL: ${url}`, { error: err.message });
    res.status(500).json({
      error: 'AUDIT_FAILED',
      message: 'Failed to complete audit. Please try again or check the URL.',
      details: process.env.NODE_ENV === 'development' ? String(err) : undefined,
    });
  }
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`GIGW UX audit backend listening on port ${PORT}`);
  console.log(`🚀 GIGW UX audit backend listening on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
});

