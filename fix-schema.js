const fs = require('fs');
const path = require('path');
const p = path.resolve(__dirname, 'backend/prisma/schema.prisma');
let content = fs.readFileSync(p, 'utf8');
content = content.replace(/@default\(uuid\(\)\)/g, '@default(dbgenerated("gen_random_uuid()"))');
fs.writeFileSync(p, content);
console.log('done');
