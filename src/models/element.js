import { Postback, Buttons, ButtonTypes } from 'models';

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
              model: Buttons
            },
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
