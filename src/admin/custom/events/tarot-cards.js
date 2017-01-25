import { get, concat } from 'lodash';
import { updateTimeStamptAndAssignIdValue } from 'utils/admin-utils';

export default class TarotCardEvent {
  preSave(req, res, args, next) {
    const images = get(args, 'data.manyToOne.Images.records', []);
    const textCards = get(args, 'data.manyToOne.TextCards.records', []);
    const questions = get(args, 'data.manyToOne.Questions.records', []);

    concat(textCards, questions, images).forEach((record) => {
      updateTimeStamptAndAssignIdValue(args, record);
    });
    next();
  };

  postSave(req, res, args, next) {
    next();
  };
};
