# GIGW UX Audit Backend

Backend service for GIGW-based UX audit of websites using Lighthouse and custom accessibility rules.

## Features

- **Lighthouse Integration**: Performance, accessibility, best practices, and SEO audits
- **Custom GIGW Rules**: Government of India website guidelines compliance (23+ rules)
- **Swagger Documentation**: Complete API documentation with interactive testing
- **Input Validation**: Robust request validation using Joi
- **Security**: Rate limiting, CORS, and security headers
- **Logging**: Structured logging with Winston
- **Error Handling**: Centralized error handling middleware

## Rules included (auto-checkable core)

| Category            | Rule ID                         | Description                                              |
| ------------------- | ------------------------------- | -------------------------------------------------------- |
| Accessibility       | GIGW_A11Y_IMG_ALT_001           | Images have appropriate alternative text                 |
| Accessibility       | GIGW_A11Y_FORM_LABEL_001        | Form fields have associated labels                       |
| Accessibility       | GIGW_A11Y_HEADINGS_001          | Page has clear heading structure                         |
| Accessibility       | GIGW_A11Y_HTML_LANG_001         | Page language is declared (html lang)                    |
| Accessibility       | GIGW_A11Y_LINK_PURPOSE_001      | Links have descriptive text                              |
| Accessibility       | GIGW_A11Y_SKIP_LINK_001         | Skip to main content link                                |
| Accessibility       | GIGW_A11Y_IFRAME_TITLE_001      | Iframes have descriptive title                           |
| Accessibility       | GIGW_A11Y_DUPLICATE_ID_001      | No duplicate IDs                                         |
| Accessibility       | GIGW_A11Y_AUTOPLAY_001          | No autoplay audio without controls                       |
| Accessibility       | GIGW_A11Y_LANDMARK_001          | Page has main content landmark                           |
| Accessibility       | GIGW_A11Y_BUTTON_NAME_001       | Buttons have accessible names                            |
| Accessibility/Quality | GIGW_QUALITY_TABLE_001        | Data tables have proper markup                           |
| Quality             | GIGW_QUALITY_PAGE_TITLE_001     | Page has descriptive title                               |
| Quality             | GIGW_QUALITY_META_DESC_001      | Page has meta description                                |
| Quality             | GIGW_QUALITY_VIEWPORT_001       | Viewport meta for responsive design                      |
| Trust & Credibility | UX4G_TRUST_PRIVACY_POLICY_001   | Privacy Policy link is present                           |
| Trust & Credibility | UX4G_TRUST_TERMS_001            | Terms & Conditions link is present                       |
| Trust & Credibility | UX4G_TRUST_CONTACT_001          | Contact / Help / FAQ links are present                   |
| Trust & Credibility | UX4G_TRUST_ABOUT_001            | About / Ownership information is present                 |
| Trust & Credibility | UX4G_TRUST_FEEDBACK_001         | Feedback / Grievance link is present                     |
| Trust & Credibility | UX4G_TRUST_GOV_BRANDING_001     | Government branding / emblem is visible (heuristic)      |
| Navigation & IA     | UX4G_NAV_SEARCH_001             | Search box is available (if needed)                      |
| Navigation & IA     | UX4G_NAV_BREADCRUMBS_001        | Breadcrumb navigation is available (where applicable)    |

## Installation

```bash
npm install
```

Install Playwright browsers (one-time):

```bash
npx playwright install
```

## Environment Setup

Copy the environment example file and configure:

```bash
cp .env.example .env
```

Edit `.env` file with your settings:

```env
PORT=4000
NODE_ENV=development
API_BASE_URL=http://localhost:4000
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on port `4000` by default.

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:4000/api-docs
- **Health Check**: http://localhost:4000/health

## API Endpoints

### Health Check
- `GET /health` - Service health status

### Audit Endpoints
- `POST /api/audit` - Run complete UX audit (GIGW rules + Lighthouse)
- `POST /api/lighthouse/audit` - Run Lighthouse-only audit
- `POST /api/lighthouse/report` - Generate HTML Lighthouse report

### Request Format

```json
{
  "url": "https://example.com"
}
```

### Complete Audit Response Format

```json
{
  "url": "https://example.com",
  "title": "Example",
  "fetchedAt": "2026-03-01T00:00:00.000Z",
  "summary": {
    "totalRules": 23,
    "passed": 18,
    "failed": 5,
    "needsReview": 0,
    "score": 78
  },
  "findings": [
    {
      "id": "GIGW_A11Y_IMG_ALT_001",
      "title": "Images have appropriate alternative text",
      "category": "Accessibility",
      "severity": "high",
      "status": "fail",
      "details": {
        "totalImages": 10,
        "missingAltCount": 5,
        "examples": [
          {
            "selector": "img.some-class",
            "htmlSnippet": "<img src=\"/foo.png\">"
          }
        ]
      },
      "suggestions": [
        "Provide meaningful alt text for all informative images."
      ]
    }
  ],
  "lighthouse": {
    "url": "https://example.com",
    "timestamp": "2026-03-01T00:00:00.000Z",
    "scores": {
      "overall": 85,
      "performance": 90,
      "accessibility": 80,
      "bestPractices": 85,
      "seo": 85
    },
    "metrics": {
      "firstContentfulPaint": 1200,
      "largestContentfulPaint": 2400,
      "cumulativeLayoutShift": 0.1,
      "totalBlockingTime": 150,
      "speedIndex": 1800
    },
    "audits": { ... },
    "opportunities": [ ... ]
  }
}
```

## Project Structure

```
src/
├── config/
│   ├── logger.js          # Winston logger configuration
│   └── swagger.js         # Swagger/OpenAPI configuration
├── middleware/
│   ├── errorHandler.js    # Centralized error handling
│   ├── security.js        # Security middleware (helmet, rate limiting)
│   └── validation.js      # Request validation with Joi
├── routes/
│   └── lighthouse.js      # Lighthouse-specific routes
├── services/
│   ├── auditRunner.js     # Main audit orchestration
│   ├── lighthouseService.js # Lighthouse integration
│   └── pageSnapshot.js    # Page snapshot service
├── rules/                 # Custom GIGW accessibility rules
└── server.js              # Main application entry point
```

## Security Features

- **Rate Limiting**: Configurable request rate limits
- **CORS**: Cross-origin resource sharing configuration
- **Security Headers**: Helmet.js for security headers
- **Input Validation**: Joi-based request validation
- **Error Sanitization**: Secure error responses in production

## Logging

- **Development**: Console output with colors
- **Production**: File-based logging (logs/combined.log, logs/error.log)
- **Structured**: JSON format for log analysis

## Development

### Adding New Rules

Create new rule files in `src/rules/` following the existing pattern:

```javascript
const rule = {
  name: 'customRule',
  description: 'Description of the rule',
  check: ($) => {
    // Your rule logic here
    return {
      passed: true,
      message: 'Rule passed'
    };
  }
};

module.exports = rule;
```

### Adding New Endpoints

1. Create route in appropriate routes file
2. Add Swagger documentation
3. Add validation if needed
4. Update API documentation

## License

MIT

