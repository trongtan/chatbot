export default (sequelize, DataTypes) => {
  const Text = sequelize.define('Text', {
    messageId: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Text;
};
