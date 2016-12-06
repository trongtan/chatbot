import { get } from 'lodash';
import { updateTimeStamptAndAssignIdValue } from 'utils/admin-utils';

export default class SymptomSynonymEvent {
  preSave(req, res, args, next) {
    const records = get(args, 'data.manyToOne.SymptomSynonym.records', []);
    records.forEach((record) => {
      updateTimeStamptAndAssignIdValue(args, record);
    });
    next();
  };
};
