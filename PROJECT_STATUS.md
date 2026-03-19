# GIGW UX Audit Backend - Current State Document

## Project Overview

| Property | Value |
|----------|-------|
| **Name** | gigw-ux-audit-backend |
| **Version** | 0.1.0 |
| **Type** | Node.js + Express Backend Service |
| **Purpose** | GIGW-based UX audit of websites using Lighthouse and custom accessibility rules |
| **Port** | 4000 (default) |
| **API Docs** | http://localhost:4000/api-docs |

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Browser Automation** | Playwright |
| **Performance Audit** | Lighthouse |
| **HTML Parsing** | Cheerio |
| **Documentation** | Swagger/OpenAPI |
| **Logging** | Winston |
| **Validation** | Joi |

---

## Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── logger.js         # Winston logging setup
│   │   └── swagger.js        # Swagger/OpenAPI config
│   ├── middleware/           # Express middleware
│   │   ├── errorHandler.js   # Global error handling
│   │   ├── security.js       # Helmet, rate limiting
│   │   └── validation.js     # Request validation
│   ├── routes/               # API routes
│   │   └── lighthouse.js     # Lighthouse-specific endpoints
│   ├── services/             # Business logic
│   │   ├── auditRunner.js    # Main audit orchestration
│   │   ├── lighthouseService.js  # Lighthouse integration
│   │   └── pageSnapshot.js   # Page fetching service
│   ├── rules/                # 24 GIGW rules (see below)
│   │   ├── index.js          # Rules registry
│   │   └── utils.js          # Rule utilities
│   └── server.js             # Main entry point
├── logs/                     # Winston log output
├── .env.example              # Environment template
├── package.json
└── README.md
```

---

## Available API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Service health check |
| GET | `/api-docs` | Swagger documentation UI |
| POST | `/api/audit` | **Complete UX audit** (GIGW + Lighthouse) |
| POST | `/api/lighthouse/audit` | Lighthouse-only audit (JSON) |
| POST | `/api/lighthouse/report` | Lighthouse audit (HTML report) |

---

## GIGW Rules Currently Implemented (24 Total)

### Accessibility Rules (11)

| Rule ID | Description | Severity |
|---------|-------------|----------|
| GIGW_A11Y_IMG_ALT_001 | Images have alternative text | High |
| GIGW_A11Y_FORM_LABEL_001 | Form fields have labels | High |
| GIGW_A11Y_HEADINGS_001 | Proper heading structure | High |
| GIGW_A11Y_HTML_LANG_001 | HTML lang attribute declared | High |
| GIGW_A11Y_LINK_PURPOSE_001 | Links have descriptive text | Medium |
| GIGW_A11Y_SKIP_LINK_001 | Skip to main content link exists | Medium |
| GIGW_A11Y_IFRAME_TITLE_001 | Iframes have title attribute | Medium |
| GIGW_A11Y_DUPLICATE_ID_001 | No duplicate element IDs | High |
| GIGW_A11Y_AUTOPLAY_001 | No autoplay audio without controls | High |
| GIGW_A11Y_LANDMARK_001 | Main content landmark exists | Medium |
| GIGW_A11Y_BUTTON_NAME_001 | Buttons have accessible names | High |

### Quality Rules (4)

| Rule ID | Description | Severity |
|---------|-------------|----------|
| GIGW_QUALITY_PAGE_TITLE_001 | Page has descriptive title | High |
| GIGW_QUALITY_META_DESC_001 | Page has meta description | Medium |
| GIGW_QUALITY_VIEWPORT_001 | Viewport meta for responsive design | High |
| GIGW_QUALITY_TABLE_001 | Data tables have proper markup | Medium |

### Trust & Credibility Rules (6)

| Rule ID | Description | Severity |
|---------|-------------|----------|
| UX4G_TRUST_PRIVACY_POLICY_001 | Privacy Policy link present | High |
| UX4G_TRUST_TERMS_001 | Terms & Conditions link present | Medium |
| UX4G_TRUST_CONTACT_001 | Contact/Help/FAQ links present | Medium |
| UX4G_TRUST_ABOUT_001 | About/Ownership info present | Medium |
| UX4G_TRUST_FEEDBACK_001 | Feedback/Grievance link present | Medium |
| UX4G_TRUST_GOV_BRANDING_001 | Government branding visible | Low |

### Navigation & IA Rules (2)

| Rule ID | Description | Severity |
|---------|-------------|----------|
| UX4G_NAV_SEARCH_001 | Search box available | Medium |
| UX4G_NAV_BREADCRUMBS_001 | Breadcrumb navigation present | Low |

---

## Security Features

| Feature | Implementation |
|---------|----------------|
| Rate Limiting | express-rate-limit (100 req/15min) |
| CORS | cors middleware configured |
| Security Headers | Helmet.js |
| Input Validation | Joi + express-validator |
| Error Sanitization | Secure error responses in production |

---

## Lighthouse Integration

### Categories Audited
- Performance
- Accessibility
- Best Practices
- SEO

### Metrics Captured
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Total Blocking Time (TBT)
- Speed Index

### Report Formats
- JSON (detailed scores & metrics)
- HTML (visual report)

---

## Current Capabilities

### What Works Now:
1. Single URL audit with GIGW rules + Lighthouse
2. 24 automated accessibility/quality rules
3. Swagger API documentation
4. Rate limiting & security headers
5. Winston logging (console + files)
6. HTML report generation
7. Error handling & validation

### Scoring System:
- Each rule weighted by severity (high=3, medium=2, low=1)
- Overall score 0-100 calculated from weighted pass/fail

---

## What's Missing / Can Be Added

### High Priority Additions:

| Feature | Description |
|---------|-------------|
| **Database Storage** | Save audit history (MongoDB/PostgreSQL) |
| **Multi-page Audit** | Crawl and audit entire websites, not just single pages |
| **PDF Report Generation** | Export audit results as PDF |
| **User Authentication** | JWT-based auth for API access |
| **Audit Comparison** | Compare audit results over time |
| **Batch Audit API** | Audit multiple URLs in one request |
| **Webhook Support** | Send results to external systems |
| **Scheduled Audits** | Cron-based recurring audits |

### Additional GIGW Rules That Can Be Added:

| Category | Potential New Rules |
|----------|---------------------|
| Accessibility | Color contrast check, Keyboard navigation, ARIA usage, Focus indicators |
| Mobile | Touch target size, Mobile font size, Responsive images |
| Security | HTTPS enforcement, Secure cookies, XSS protection headers |
| Performance | Image optimization, Lazy loading, CDN usage |
| Content | Broken links, Spelling check, Readability score |
| Compliance | Copyright notice, Last updated date, Accessibility statement |

### Technical Improvements:

| Improvement | Description |
|-------------|-------------|
| **Caching** | Redis cache for audit results |
| **Queue System** | Bull queue for handling multiple audits |
| **Docker** | Containerize the application |
| **Tests** | Unit tests + Integration tests (Jest/Mocha) |
| **CI/CD** | GitHub Actions for deployment |
| **Monitoring** | Health checks + metrics (Prometheus/Grafana) |
| **Rate Limit per User** | API key-based rate limiting |

### Frontend Integration Options:

| Option | Description |
|--------|-------------|
| **Dashboard UI** | React/Vue dashboard to view results |
| **Browser Extension** | Chrome extension for quick audits |
| **CLI Tool** | Command-line interface for local use |

---

## Environment Configuration

```env
PORT=4000
NODE_ENV=development
API_BASE_URL=http://localhost:4000
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Dependencies Summary

### Production:
- express, cors, helmet, morgan (server)
- lighthouse, chrome-launcher (auditing)
- playwright (browser automation)
- cheerio (HTML parsing)
- joi, express-validator (validation)
- winston (logging)
- swagger-jsdoc, swagger-ui-express (docs)

### Dev:
- nodemon (auto-restart)

---

*Document generated on: March 19, 2026*
*Project version: 0.1.0*
