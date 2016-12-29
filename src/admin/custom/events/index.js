import moment from 'moment';
import shortid from 'shortid';

import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import WatchwordEvent from './watchword';
import ConversationEvent from './conversation';
import ConversationStepEvent from './conversation-steps';

const childEvents = {
  'Watchword': new WatchwordEvent(),
  'Conversations': new ConversationEvent(),
  'ConversationSteps': new ConversationStepEvent()
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
