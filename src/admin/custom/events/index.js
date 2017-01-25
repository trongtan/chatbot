import moment from 'moment';
import shortid from 'shortid';

import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import BlockEvent from './blocks';
import TarotCardEvent from './tarot-cards';

const childEvents = {
  'Blocks': new BlockEvent(),
  'TarotCards': new TarotCardEvent()
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

export const postSave = (req, res, args, next) => {
  if (childEvents[args.name]) {
    childEvents[args.name].postSave(req, res, args, next);
  } else {
    next();
  }
};
