import moment from 'moment';
import shortid from 'shortid';

import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import WatchwordEvent from './watchword';
import DiseaseSynonymEvent from './disease-synonym';
import SymptomSynonymEvent from './symptom-synonym';
import GroupEvent from './group';
import ButtonEvent from './button';

const childEvents = {
  'Watchword': new WatchwordEvent(),
  'Disease': new DiseaseSynonymEvent(),
  'Symptom': new SymptomSynonymEvent(),
  'Group': new GroupEvent(),
  'Button': new (ButtonEvent)
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
