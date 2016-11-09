'use strict';
module.exports = function (sequelize, DataTypes) {
  var Symptom = sequelize.define('Symptom', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        this.belongsToMany(models.Disease, {
          through: 'DiseaseSymptoms',
          foreignKey: 'id'
        });
      }
    }
  });

  return Symptom;
};
