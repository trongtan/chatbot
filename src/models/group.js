import Promise from 'promise';

export default (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    name: DataTypes.STRING
  }, {
    freezeTableName: true,
    classMethods: {
      findByName: (groupName) => {
        return Group.findAll({
          attributes: ['id', 'name'],
          where: {
            name: groupName
          },
          raw: true
        }).then(groups => {
          return Promise.resolve(groups.map(group => {
            return group.id;
          }));
        });
      }
    }
  });
  return Group;
};
