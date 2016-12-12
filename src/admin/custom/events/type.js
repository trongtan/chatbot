import { get, concat } from 'lodash';
import { updateTimeStamptAndAssignIdValue } from 'utils/admin-utils';

export default class TypeEvent {
  preSave(req, res, args, next) {
    const TypeSynonymRecords = get(args, 'data.manyToOne.TypeSynonym.records', []);
    const TypeMessageRecords = get(args, 'data.manyToOne.TypeMessage.records', []);
    const records = concat(TypeSynonymRecords, TypeMessageRecords);

    records.forEach((record) => {
      updateTimeStamptAndAssignIdValue(args, record);
    });
    next();
  };
};
