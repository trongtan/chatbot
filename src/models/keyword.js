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
          where: {
            group: keywordGroupConstants.GREETING
          }
        });
      }
    }
  });

  return Keyword;
};
