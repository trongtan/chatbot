export default (sequelize, DataTypes) => {
  const RSS = sequelize.define('RSS', {
    title: DataTypes.STRING,
    rssURL: DataTypes.STRING,
    postbackId: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return RSS;
};
