import { get, concat } from 'lodash';
import { updateTimeStamptAndAssignIdValue } from 'utils/admin-utils';

export default class WatchwordEvent {
  preSave(req, res, args, next) {
    const textCards = get(args, 'data.manyToOne.TextCards.records', []);
    const galleries = get(args, 'data.manyToOne.Galleries.records', []);
    const images = get(args, 'data.manyToOne.Images.records', []);
    const quickReplies = get(args, 'data.manyToOne.QuickReplies.records', []);

    concat(textCards, galleries, images, quickReplies).forEach((record) => {
      updateTimeStamptAndAssignIdValue(args, record);
    });
    next();
  };

  postSave(req, res, args, next) {
    next();
  };
};
