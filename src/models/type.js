import Promise from 'promise';

export default (sequelize, DataTypes) => {
  const Type = sequelize.define('Type', {
    value: DataTypes.STRING
  }, {
    freezeTableName: true,
    classMethods: {
      findTypesByIds: (ids) => {
        return Type.findAll({
          attributes: ['value'],
          where: {
            id: {
              $in: ids
            }
          },
          raw: true
        }).then(types => {
          return Promise.resolve(types.map(type => {
            return type.value;
          }));
        });
      },
      findTypeIdByValue: (value) => {
        return Type.findOne({
          attributes: ['id'],
          where: {
            value: value
          }
        }).then(type => {
          return Promise.resolve(type.id);
        })
      }
    }
  });

  return Type;
};
