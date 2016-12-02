import moment from 'moment';
import shortid from 'shortid';

import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { logger } from 'logs/winston-logger';

export const preSave = (req, res, args, next) => {
  var now = moment().format(DEFAULT_DATE_FORMAT),
    record = args.data.view[args.name].records[0].columns;

  if (args.action == 'insert') {
    record.createdAt = now;
    record.updatedAt = now;
    record.id = shortid.generate();
  }
  else if (args.action == 'update') {
    record.updatedAt = now;
  }

  logger.info('[Admin PreSave] %s', JSON.stringify(record));

  next();
}
