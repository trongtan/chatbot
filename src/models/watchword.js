export default (sequelize, DataTypes) => {
  const Watchword = sequelize.define('Watchword', {
    value: DataTypes.STRING
  }, {
    freezeTableName: true,
    classMethods: {
      findAllWatchword: () => {
        return Watchword.findAll({ include: [{ all: true, nested: true }]});
      }
    }
  });
  return Watchword;
};
