import Promise from 'promise';

export default (sequelize, DataTypes) => {
  return sequelize.define('Type', {
    value: DataTypes.STRING
  }, {
    freezeTableName: true,
    classMethods: {
      associate: function (models) {
        this.hasMany(models.TypeDisease);
        this.hasMany(models.TypeSynonym);
      },
      findTypesByIds: (ids) => {
        return Type.findAll({
          attributes: ['value'],
          where: {
            id: {
              $in: ids
            }
          }
        }).then(types => {
          return Promise.resolve(types.map(type => {
            return type.value;
          }));
        });
      }
    }
  });
};
