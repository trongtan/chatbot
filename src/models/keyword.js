import { keywordGroupConstants } from 'utils/constants';

export default (sequelize, DataTypes) => {
  const Keyword = sequelize.define('Keyword', {
    value: DataTypes.STRING,
    group: DataTypes.STRING
  }, {
    freezeTableName: true,
    classMethods: {
      findAllGreeting: () => {
        return Keyword.findAll({
          attributes: ['value'],
          where: {
            group: keywordGroupConstants.GREETING
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
