import { updateTimeStamptAndAssignIdValue } from 'utils/admin-utils';

export default class TypeSynonymEvent {
  preSave(req, res, args, next) {
    const records = args.data.manyToOne.TypeSynonym.records;
    if (records && records.length > 0) {
      records.forEach((record) => {
        updateTimeStamptAndAssignIdValue(args, record);
      });
    }
    next();
  };
};
