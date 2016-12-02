import moment from 'moment';
import shortid from 'shortid';

import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import TypeSynonymEvent from './type-synonym';

const childEvents = {
  'Type': new TypeSynonymEvent()
}

export const preSave = (req, res, args, next) => {
  const now = moment().format(DEFAULT_DATE_FORMAT),
    record = args.data.view[args.name].records[0].columns;

  if (args.action == 'insert') {
    record.createdAt = now;
    record.updatedAt = now;
    record.id = shortid.generate();
  }
  else if (args.action == 'update') {
    record.updatedAt = now;
  }

  if (childEvents[args.name]) {
    childEvents[args.name].preSave(req, res, args, next);
  } else {
    next();
  }
}
