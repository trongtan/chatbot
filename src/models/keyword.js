import co from 'co';

import { payloadConstants } from 'utils/constants';
import { Group } from 'models';

export default (sequelize, DataTypes) => {
  const Keyword = sequelize.define('Keyword', {
    value: DataTypes.STRING
  }, {
    freezeTableName: true,
    classMethods: {
      findKeyWordsByGroup: (group) => {
        return co(function *() {
          return Keyword.findAll({
            attributes: ['value'],
            where: {
              groupId: {
                $in: yield Group.findByName(group)
              }
            }
          }).then(results => {
            return results.map(result => {
              return result.value;
            });
          });
        });
      },
      findGroupNameByKeyword: (keyword) => {
        return Keyword.findOne({
          include: Group,
          where: {
            value: {
              $like: keyword
            }
          }
        }).then( result => {
          return result ? result.Group.name : payloadConstants.UNSUPPORTED_PAYLOAD
        });
      }
    }
  });

  return Keyword;
};
