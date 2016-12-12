import Promise from 'promise';

export default (sequelize, DataTypes) => {
  const Type = sequelize.define('Type', {
    value: DataTypes.STRING
  }, {
    freezeTableName: true,
    classMethods: {
      associate: function (models) {
        this.hasMany(models.TypeDisease);
        this.hasMany(models.TypeSynonym);
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
