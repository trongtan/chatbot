import { updateTimeStamptAndAssignIdValue } from 'utils/admin-utils';

export default class SymptomSynonymEvent {
  preSave(req, res, args, next) {
    const records = args.data.manyToOne.SymptomSynonym.records;
    if (records && records.length > 0) {
      records.forEach((record) => {
        updateTimeStamptAndAssignIdValue(args, record);
      });
    }
    next();
  };
};
