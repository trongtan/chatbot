import { get } from 'lodash';
import { updateTimeStamptAndAssignIdValue } from 'utils/admin-utils';

export default class DiseaseSynonymEvent {
  preSave(req, res, args, next) {
    const records = get(args, 'data.manyToOne.DiseaseSynonym.records', []);
    records.forEach((record) => {
      updateTimeStamptAndAssignIdValue(args, record);
    });
    next();
  };
};
