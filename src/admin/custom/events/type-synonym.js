import { get } from 'lodash';
import { updateTimeStamptAndAssignIdValue } from 'utils/admin-utils';

export default class TypeSynonymEvent {
  preSave(req, res, args, next) {
    const records = get(args, 'data.manyToOne.TypeSynonym.records', []);
    records.forEach((record) => {
      updateTimeStamptAndAssignIdValue(args, record);
    });
    next();
  };
};
