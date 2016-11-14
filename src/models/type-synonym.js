export default (sequelize, DataTypes) => {
  const TypeSynonym = sequelize.define('TypeSynonym', {
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

  return TypeSynonym;
};
