export default (sequelize, DataTypes) => {
  return sequelize.define('TypeSynonym', {
    value: DataTypes.STRING
  }, {
    freezeTableName: true,
    classMethods: {
      findAllTypeSynonyms: () => {
        return TypeSynonym.findAll({
          attributes: ['typeId', 'value'],
          raw: true
        });
      }
    }
  });
};
