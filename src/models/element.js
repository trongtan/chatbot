import { Postback } from 'models';

export default (sequelize, DataTypes) => {
  const Element = sequelize.define('Element', {
    title: DataTypes.STRING,
    itemURL: DataTypes.STRING,
    imageURL: DataTypes.STRING,
    subtitle: DataTypes.TEXT
  }, {
    classMethods: {
      findAllByPostbackValue: (postback) => {
        return Element.findAll({
          include: [
            {
              model: Postback,
              as: 'Postback',
              where: {
                value: postback
              }
            }]
        });
      }
    }
  });
  return Element;
};
