const express = require('express');
const lighthouseService = require('../services/lighthouseService');
const { validateAuditRequest } = require('../middleware/validation');

const router = express.Router();

// Get Lighthouse-only audit
router.post('/audit', async (req, res) => {
  const { url } = req.body || {};

  if (!url || typeof url !== 'string') {
    return res.status(400).json({
      error: 'INVALID_INPUT',
      message: 'Field "url" is required and must be a string.',
    });
  }

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

// Generate HTML report
router.post('/report', async (req, res) => {
  const { url } = req.body || {};

  if (!url || typeof url !== 'string') {
    return res.status(400).json({
      error: 'INVALID_INPUT',
      message: 'Field "url" is required and must be a string.',
    });
  }

  try {
    const report = await lighthouseService.runLighthouseAudit(url);
    const htmlReport = lighthouseService.generateHtmlReport(report);
    
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlReport);
  } catch (err) {
    console.error('Lighthouse report generation error:', err);
    res.status(500).json({
      error: 'REPORT_GENERATION_FAILED',
      message: 'Failed to ge