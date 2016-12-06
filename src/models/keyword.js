export default (sequelize, DataTypes) => {
  const Keyword = sequelize.define('Keyword', {
    value: DataTypes.STRING,
    group: DataTypes.STRING
  }, {
    freezeTableName: true,
    classMethods: {
      findKeyWordsByGroup: (group) => {
        return Keyword.findAll({
          attributes: ['value'],
          where: {
            group: group
          },
          raw: true
        }).then(results => {
          return results.map(result => {
            return result.value;
          });
        });
      }
    }
  });

  return Keyword;
};
