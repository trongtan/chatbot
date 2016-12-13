import Promise from 'promise';
import co from 'co';

import { Group } from 'models';

export default (sequelize, DataTypes) => {
  const GroupMessage = sequelize.define('GroupMessage', {
    text: DataTypes.STRING
  }, {
    freezeTableName: true,
    classMethods: {
      findMesageByGroupName: (groupName) => {
        return co(function *() {
          return GroupMessage.findAll({
            attributes: ['id', 'text'],
            include: [{
              model: Group,
              as: 'Groups',
              where: { name: groupName }
            }]
          }).then(groupMessages => {
            return Promise.resolve(groupMessages);
          });
        });
      }
    }
  });
  return GroupMessage;
};
