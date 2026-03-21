const fs = require('fs');
const path = require('path');

const rulesDir = path.join(__dirname, 'src', 'rules');

const moveMap = {
  accessibility: [
    'imageAltRule.js', 'formLabelRule.js', 'htmlLangRule.js', 'linkPurposeRule.js', 
    'tableStructureRule.js', 'skipLinkRule.js', 'iframeTitleRule.js', 'duplicateIdRule.js', 
    'documentLandmarkRule.js', 'buttonAccessibleNameRule.js', 'autoplayMediaRule.js'
  ],
  trust: [
    'privacyPolicyRule.js', 'termsConditionsRule.js', 'contactInfoRule.js', 
    'aboutOwnershipRule.js', 'feedbackLinkRule.js', 'govBrandingRule.js'
  ],
  quality: [
    'headingStructureRule.js', 'pageTitleRule.js', 'metaDescriptionRule.js', 
    'viewportRule.js', 'searchBoxRule.js'
  ],
  navigation: [
    'breadcrumbsRule.js'
  ]
};

// Ensure directories
for (const cat of Object.keys(moveMap)) {
  const p = path.join(rulesDir, cat);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

for (const [cat, files] of Object.entries(moveMap)) {
  for (const file of files) {
    const oldPath = path.join(rulesDir, file);
    const newPath = path.join(rulesDir, cat, file);
    if (fs.existsSync(oldPath)) {
      let content = fs.readFileSync(oldPath, 'utf8');
      
      // Attempt some regex string replacements to adapt to the new return format.
      // E.g., changing id: to ruleId:
      content = content.replace(/id:\s*['"](.*?)['"]/g, `ruleId: '$1'`);
      // It's safer to adapt the output in index.js, but let's at least move them.
      
      fs.renameSync(oldPath, newPath);
    }
  }
}

console.log('Moved files');
