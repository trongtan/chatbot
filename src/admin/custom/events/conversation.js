import { get } from 'lodash';
import { updateTimeStamptAndAssignIdValue } from 'utils/admin-utils';

export default class ConversationEvent {
  preSave(req, res, args, next) {
    const conversationDialogs = get(args, 'data.manyToOne.ConversationDialogs.records', []);

    conversationDialogs.forEach((record) => {
      updateTimeStamptAndAssignIdValue(args, record);
    });
    next();
  };
};
