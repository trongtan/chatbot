import { Watchword, Postback } from 'models';

export default (sequelize, DataTypes) => {
  const Synonym = sequelize.define('Synonym', {
    value: DataTypes.STRING,
    watchwordId: DataTypes.STRING
  }, {
    freezeTableName: true,
    classMethods: {
      findAllWatchwordSynonyms: () => {
        return Synonym.findAll({ include: [{ all: true, nested: true }]});
      }
    }
  });
  return Synonym;
};
