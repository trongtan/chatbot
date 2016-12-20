import { Postback, Buttons, ButtonTypes, Messages } from 'models';

export default (sequelize, DataTypes) => {
  const ButtonTemplate = sequelize.define('ButtonTemplate', {
    title: DataTypes.STRING
  }, {
    classMethods: {
      findAllByPostbackValue: (postback) => {
        return ButtonTemplate.findAll({
          include: [
            {
              model: Messages
            },
            {
              model: Buttons,
              as: "Buttons",
              include: [
                {
                  model: ButtonTypes,
                  as: 'ButtonTypes'
                },
                {
                  model: Postback,
                  as: 'Postback'
                }]
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
  return ButtonTemplate;
};
