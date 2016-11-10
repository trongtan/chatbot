import path from 'path';
import winston from 'winston';

export const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      name: 'life-pedia-log-debug',
      level: 'debug',
      timestamp: true
    }),
    new (winston.transports.File)({
      name: 'life-pedia-log-info',
      filename: path.join(__dirname, 'life-pedia-log-info.log'),
      level: 'info',
      timestamp: true
    }),
    new (winston.transports.File)({
      name: 'life-pedia-log-error',
      filename: path.join(__dirname, 'life-pedia-log-error.log'),
      level: 'error',
      timestamp: true
    })
  ]
});
