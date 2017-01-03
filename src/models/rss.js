import { Postback } from 'models';
import { DEFAULT_MAXIMUM_QUICK_REPLY_ELEMENT } from 'utils/constants';

export default (sequelize, DataTypes) => {
  const RSS = sequelize.define('RSS', {
    title: DataTypes.STRING,
    rssURL: DataTypes.STRING,
    postbackId: DataTypes.STRING
  }, {
    classMethods: {
      findAllRSS: () => {
        return RSS.findAll({
          limit: DEFAULT_MAXIMUM_QUICK_REPLY_ELEMENT,
          include: [
            {
              model: Postback,
              as: 'Postback'
            }
          ]
        });
      }
    }
  });
  return RSS;
};
