export default (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    title: DataTypes.STRING,
    itemURL: DataTypes.STRING,
    imageURL: DataTypes.STRING,
    subtitle: DataTypes.TEXT
  }, {
    classMethods: {}
  });
  return Article;
};
