const fs = require('fs');
const path = require('path');
const filePath = path.join(process.cwd(), 'src/pages/Login.jsx');
let c = fs.readFileSync(filePath, 'utf8');
c = c.replace(/import Particles from ['"]react-tsparticles['"];\n/, '');
c = c.replace(/\s*\{\/\* Particles background \*\/\}[\s\S]*?\s*\/>\n/, '');
fs.writeFileSync(filePath, c);
console.log('Done');
