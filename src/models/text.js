import { Messages, Postback } from 'models';

export default (sequelize, DataTypes) => {
  const Text = sequelize.define('Text', {}, {
    classMethods: {
      findAllByPostbackValue: (postback) => {
        return Text.findAll({
          include: [
            {
              model: Messages
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
  return Text;
};
