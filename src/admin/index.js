import express from 'express';
import expressAdmin from 'express-admin';
import { logger } from 'logs/winston-logger';
import { expressConfig } from 'admin/config';
import { en } from 'admin/custom';

const app = express();

expressAdmin.init(expressConfig, function (err, admin) {
  if (err) {
    logger.error(`[Express Admin] ${err}`);
    return;
  }

  expressConfig.langs.en = en;

  app.use('/admin', admin);
});

export default app;
