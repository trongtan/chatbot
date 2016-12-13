export default (sequelize, DataTypes) => {
  const TypeMessage = sequelize.define('TypeMessage', {
    text: DataTypes.STRING
  }, {
    freezeTableName: true,
    classMethods: {
      findMessageByTypeId: (typeId) => {
        return TypeMessage.findAll({
          where: {
            typeId: typeId
          }
        });
      }
    }
  });
  return TypeMessage;
};
