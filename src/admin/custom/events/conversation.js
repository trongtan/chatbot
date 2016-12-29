import { get } from 'lodash';
import { updateTimeStamptAndAssignIdValue } from 'utils/admin-utils';

export default class ConversationEvent {
  preSave(req, res, args, next) {
    const conversationSteps = get(args, 'data.manyToOne.ConversationSteps.records', []);

    conversationSteps.forEach((record) => {
      updateTimeStamptAndAssignIdValue(args, record);
    });
    next();
  };
};
