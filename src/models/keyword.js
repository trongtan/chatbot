import co from 'co';
import { Group } from 'models';

export default (sequelize, DataTypes) => {
  const Keyword = sequelize.define('Keyword', {
    value: DataTypes.STRING,
    group: DataTypes.STRING
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
            },
            raw: true
          }).then(results => {
            return results.map(result => {
              return result.value;
            });
          });
        });
      }
    }
  });

  return Keyword;
};
