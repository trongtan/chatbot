import fs from 'fs';
import path from 'path';

const fpath = path.join(__dirname, './config/custom.json');
const data = fs.readFileSync(fpath, 'utf8');
fs.writeFileSync(fpath,
  data.replace(/APP_DIR\/admin/g, __dirname)
);
