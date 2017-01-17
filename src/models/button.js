import { Block } from 'models';

export default (sequelize, DataTypes) => {
  const Button = sequelize.define('Buttons', {
    name: DataTypes.STRING,
    type: DataTypes.INTEGER,
    URL: DataTypes.STRING,
    inAppBrowserSize: DataTypes.INTEGER,
    phoneNumber: DataTypes.STRING
  }, {
    classMethods: {
      getButtonById: (buttonId) => {
        return Button.findOne({
          where: {
            id: buttonId
          },
          include: [
            {
              model: Block,
              as: 'Block'
            }
          ]
        })
      }
    }
  });
  return Button;
};
