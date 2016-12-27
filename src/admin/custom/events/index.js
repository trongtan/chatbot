import moment from 'moment';
import shortid from 'shortid';

import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import WatchwordEvent from './watchword';

const childEvents = {
  'Watchword': new WatchwordEvent()
};

export const preSave = (req, res, args, next) => {
  const record = args.data.view[args.name].records[0].columns;
  const now = moment().format(DEFAULT_DATE_FORMAT);

  record.updatedAt = now;
  if (args.action == 'insert') {
    record.createdAt = now;
    record.id = shortid.generate();
  }

  if (childEvents[args.name]) {
    childEvents[args.name].preSave(req, res, args, next);
  } else {
    next();
  }
};
