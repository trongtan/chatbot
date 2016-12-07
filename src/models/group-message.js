import Promise from 'promise';
import co from 'co';

import { Group } from 'models';

export default (sequelize, DataTypes) => {
  const GroupMessage = sequelize.define('GroupMessage', {
    text: DataTypes.STRING
  }, {
    freezeTableName: true,
    classMethods: {
      findMesageByGroup: (group) => {
        return co(function *() {
          return GroupMessage.findAll({
            attributes: ['id', 'text'],
            where: {
              groupId: {
                $in: yield Group.findByName(group)
              }
            },
            raw: true
          }).then(groupMessages => {
            return Promise.resolve(groupMessages);
          });
        });
      }
    }
  });
  return GroupMessage;
};
