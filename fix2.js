const fs = require('fs');
const path = require('path');

const dirs = ['accessibility', 'trust', 'quality', 'navigation'];
dirs.forEach(d => {
  const p = path.join('src/rules', d);
  fs.readdirSync(p).forEach(f => {
    if(f.endsWith('.js')){
      const fp = path.join(p, f);
      let c = fs.readFileSync(fp, 'utf8');
      c = c.replace(/require\(['"](\.\.\/\.\.|\.\.)?\/utils['"]\)/g, "require('../utils')");
      fs.writeFileSync(fp, c);
    }
  });
});
console.log('Fixed requires correctly');