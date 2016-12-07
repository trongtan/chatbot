import { get, concat } from 'lodash';
import { updateTimeStamptAndAssignIdValue } from 'utils/admin-utils';

export default class GroupEvent {
  preSave(req, res, args, next) {
    const GroupMessageRecords = get(args, 'data.manyToOne.GroupMessage.records', []);
    const ButtonRecords = get(args, 'data.manyToOne.Button.records', []);
    const records = concat(GroupMessageRecords, ButtonRecords);

    records.forEach((record) => {
      updateTimeStamptAndAssignIdValue(args, record);
    });
    next();
  };
};
