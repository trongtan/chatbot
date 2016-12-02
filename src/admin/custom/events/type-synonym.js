import moment from 'moment';
import shortid from 'shortid';

import { DEFAULT_DATE_FORMAT } from 'utils/constants';

export default class TypeSynonymEvent {
  preSave(req, res, args, next) {
    const records = args.data.manyToOne.TypeSynonym.records;
    if (records && records.length > 0) {
      const now = moment().format(DEFAULT_DATE_FORMAT);
      records.forEach(function (record) {
        record.columns.updatedAt = now;

        if (record.insert) {
          record.columns.id = shortid.generate();
          record.columns.createdAt = now;
        }
      });
    }
    next();
  };
}
