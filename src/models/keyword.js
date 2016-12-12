import co from 'co';

import { payloadConstants } from 'utils/constants';
import { Group } from 'models';

export default (sequelize, DataTypes) => {
  const Keyword = sequelize.define('Keyword', {
    value: DataTypes.STRING
  }, {
    freezeTableName: true,
    classMethods: {
      findKeyWordsByGroupName: (groupName) => {
        return co(function *() {
          return Keyword.findAll({
            attributes: ['value'],
            include: [{
              model: Group,
              as: 'Groups',
              where: { name: groupName }
            }]
          }).then(results => {
            return results.map(result => {
              return result.value;
            });
          });
        });
      },
      findGroupNameByKeyword: (keyword) => {
        return Keyword.findOne({
          include: [{
            model: Group,
            as: 'Groups',
          }],
          where: {
            value: {
              $like: keyword
            }
          }
        }).then(result => {
          return result ? result.Groups.name : payloadConstants.UNSUPPORTED_PAYLOAD
        });
      },
      findKeywordByName: (keywordName) => {
        return Keyword.findOne({
          where: {
            value: {
              $like: keywordName
            }
          }
        })
      }
    }
  });

  return Keyword;
};
