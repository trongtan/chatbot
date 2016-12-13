import moment from 'moment';
import shortid from 'shortid';

import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import TypeEvent from './type';
import DiseaseSynonymEvent from './disease-synonym';
import SymptomSynonymEvent from './symptom-synonym';
import GroupEvent from './group';

const childEvents = {
  'Type': new TypeEvent(),
  'Disease': new DiseaseSynonymEvent(),
  'Symptom': new SymptomSynonymEvent(),
  'Group': new GroupEvent()
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
