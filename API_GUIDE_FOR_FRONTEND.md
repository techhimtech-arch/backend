# GIGW UX Audit API - Frontend Integration Guide

> **Base URL:** `http://localhost:4000` (development)  
> **API Docs:** `http://localhost:4000/api-docs` (Swagger UI)

---

## Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health check |
| `POST` | `/api/audit` | **Complete UX Audit** (GIGW + Lighthouse) |
| `POST` | `/api/lighthouse/audit` | Lighthouse-only audit (JSON) |
| `POST` | `/api/lighthouse/report` | Lighthouse audit (HTML report) |

---

## 1. Health Check

**Request:**
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "service": "gigw-ux-audit-backend"
}
```

---

## 2. Complete UX Audit (Recommended)

**Endpoint:** `POST /api/audit`

**Request Body:**
```json
{
  "url": "https://example.gov.in"
}
```

**Response Structure:**
```json
{
  "url": "https://example.gov.in",
  "timestamp": "2026-03-19T07:00:00.000Z",
  "gigw": {
    "score": 85,
    "passed": 20,
    "failed": 4,
    "total": 24,
    "violations": [
      {
        "rule": "GIGW_A11Y_IMG_ALT_001",
        "message": "Images missing alt text",
        "severity": "high"
      }
    ]
  },
  "lighthouse": {
    "performance": 78,
    "accessibility": 92,
    "bestPractices": 85,
    "seo": 88,
    "metrics": {
      "fcp": "1.2s",
      "lcp": "2.1s",
      "cls": 0.05,
      "tbt": "150ms"
    }
  }
}
```

---

## 3. Lighthouse-Only Audit

**Endpoint:** `POST /api/lighthouse/audit`

**Request Body:**
```json
{
  "url": "https://example.gov.in"
}
```

**Use Case:** When you only need performance metrics without GIGW compliance rules.

---

## 4. HTML Report Generation

**Endpoint:** `POST /api/lighthouse/report`

**Request Body:**
```json
{
  "url": "https://example.gov.in"
}
```

**Response:** Returns HTML report (Content-Type: `text/html`)

**Use Case:** When you want to display/download a visual Lighthouse report.

---

## Error Responses

### 400 - Bad Request
```json
{
  "error": "VALIDATION_ERROR",
  "message": "URL is required"
}
```

### 500 - Server Error
```json
{
  "error": "AUDIT_FAILED",
  "message": "Failed to complete audit. Please try again or check the URL."
}
```

---

## Frontend Integration Examples

### React Hook Example
```javascript
import { useState } from 'react';

const useUXAudit = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const runAudit = async (url) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:4000/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      if (!response.ok) throw new Error('Audit failed');
      
      const data = await response.json();
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { runAudit, loading, result, error };
};

export default useUXAudit;
```

### Vue Composable Example
```javascript
import { ref } from 'vue';

export function useUXAudit() {
  const loading = ref(false);
  const result = ref(null);
  const error = ref(null);

  const runAudit = async (url) => {
    loading.value = true;
    error.value = null;
    
    try {
      const res = await fetch('http://localhost:4000/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      result.value = await res.json();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { runAudit, loading, result, error };
}
```

---

## Score Display Guide

| Score Range | Color | Status |
|-------------|-------|--------|
| 90-100 | Green | Excellent |
| 70-89 | Yellow | Needs Improvement |
| 0-69 | Red | Poor |

---

## Rule Categories

### 1. Accessibility (11 Rules)
- Image alt text
- Form labels
- Heading structure
- HTML lang attribute
- Link purpose
- Skip links
- Iframe titles
- Duplicate IDs
- Autoplay media
- Landmark regions
- Button names

### 2. Quality (4 Rules)
- Page title
- Meta description
- Viewport meta
- Table markup

### 3. Trust & Credibility (6 Rules)
- Privacy policy link
- Terms & conditions
- Contact/Help/FAQ
- About/Ownership info
- Feedback/Grievance
- Government branding

### 4. Navigation (2 Rules)
- Search box
- Breadcrumb navigation

---

## Important Notes

1. **Rate Limiting:** 100 requests per 15 minutes
2. **Request Timeout:** Large pages may take 10-30 seconds
3. **CORS:** Enabled for all origins in development
4. **URL Format:** Must include protocol (`https://`)

---

## Testing with cURL

```bash
# Health check
curl http://localhost:4000/health

# Complete audit
curl -X POST http://localhost:4000/api/audit \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.gov.in"}'

# Lighthouse only
curl -X POST http://localhost:4000/api/lighthouse/audit \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.gov.in"}'

# HTML report
curl -X POST http://localhost:4000/api/lighthouse/report \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.gov.in"}' \
  -o report.html
```

---

*Last Updated: March 19, 2026*
