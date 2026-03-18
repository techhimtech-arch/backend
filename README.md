## GIGW UX Audit Backend (Phase 1)

Simple Node.js backend that accepts a URL, loads the page with Playwright, runs **23+ auto-checkable GIGW/WCAG/UX4G rules**, and returns a JSON report.

### Rules included (auto-checkable core)

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

### 1. Install dependencies

From the `backend` folder:

```bash
npm install
```

Install Playwright browsers (one-time):

```bash
npx playwright install
```

### 2. Run the server

```bash
npm start
```

The server will start on port `4000` by default.

Health check:

- `GET http://localhost:4000/health`

### 3. Run an audit

Endpoint:

- `POST http://localhost:4000/api/audit`

Body (JSON):

```json
{
  "url": "https://example.com"
}
```

Sample response shape (simplified):

```json
{
  "url": "https://example.com",
  "title": "Example",
  "fetchedAt": "2026-03-01T00:00:00.000Z",
  "summary": {
    "totalRules": 3,
    "passed": 2,
    "failed": 1,
    "needsReview": 0,
    "score": 67
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
  ]
}
```

You can build any frontend (React, plain HTML, etc.) that:

- Takes a URL input
- Calls this `/api/audit` endpoint
- Displays `summary` and `findings` to the user

