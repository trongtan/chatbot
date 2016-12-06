import { get } from 'lodash';
import { updateTimeStamptAndAssignIdValue } from 'utils/admin-utils';

export default class GroupEvent {
  preSave(req, res, args, next) {
    const records = get(args, 'data.manyToOne.GroupMessage.records', []);

    records.forEach((record) => {
      updateTimeStamptAndAssignIdValue(args, record);
    });
    next();
  };
};
