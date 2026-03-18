const express = require('express');
const lighthouseService = require('../services/lighthouseService');
const { validateAuditRequest } = require('../middleware/validation');

const router = express.Router();

/**
 * @swagger
 * /api/lighthouse/audit:
 *   post:
 *     summary: Run Lighthouse-only audit
 *     tags: [Lighthouse]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuditRequest'
 *     responses:
 *       200:
 *         description: Lighthouse audit completed successfully
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
router.post('/audit', validateAuditRequest, async (req, res) => {
  const { url } = req.body;

  try {
    const report = await lighthouseService.runLighthouseAudit(url);
    res.json(report);
  } catch (err) {
    console.error('Lighthouse audit error:', err);
    res.status(500).json({
      error: 'LIGHTHOUSE_AUDIT_FAILED',
      message: 'Failed to complete Lighthouse audit. Please try again or check the URL.',
      details: process.env.NODE_ENV === 'development' ? String(err) : undefined,
    });
  }
});

/**
 * @swagger
 * /api/lighthouse/report:
 *   post:
 *     summary: Generate HTML Lighthouse report
 *     tags: [Lighthouse]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuditRequest'
 *     responses:
 *       200:
 *         description: HTML report generated successfully
 *         content:
 *           text/html:
 *             schema:
 *               type: string
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
router.post('/report', validateAuditRequest, async (req, res) => {
  const { url } = req.body;

  try {
    const report = await lighthouseService.runLighthouseAudit(url);
    const htmlReport = lighthouseService.generateHtmlReport(report);
    
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlReport);
  } catch (err) {
    console.error('Lighthouse report generation error:', err);
    res.status(500).json({
      error: 'REPORT_GENERATION_FAILED',
      message: 'Failed to generate Lighthouse report.',
    });
  }
});

module.exports = router;
