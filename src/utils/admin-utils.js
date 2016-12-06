import moment from 'moment';
import shortid from 'shortid';

import { DEFAULT_DATE_FORMAT } from 'utils/constants';

export const updateTimeStamptAndAssignIdValue = (args, record) => {
  const now = moment().format(DEFAULT_DATE_FORMAT);
  record.columns.updatedAt = now;

  if (record.insert) {
    record.columns.id = shortid.generate();
    record.columns.createdAt = now;
  }
};
