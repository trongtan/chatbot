import { get } from 'lodash';
import { updateTimeStamptAndAssignIdValue } from 'utils/admin-utils';

export default class WatchwordEvent {
  preSave(req, res, args, next) {
    const synonymRecords = get(args, 'data.manyToOne.Synonym.records', []);

    synonymRecords.forEach((record) => {
      updateTimeStamptAndAssignIdValue(args, record);
    });
    next();
  };

  postSave(req, res, args, next) {
    next();
  };
};
