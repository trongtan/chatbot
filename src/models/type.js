export default (sequelize, DataTypes) => {
  return sequelize.define('Type', {
    value: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        this.hasMany(models.TypeDisease);
        this.hasMany(models.TypeSynonym);
      }
    }
  });
};
