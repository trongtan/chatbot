import { Messages, Postback, QuickReplies } from 'models';

export default (sequelize, DataTypes) => {
  const Text = sequelize.define('Text', {
    title: DataTypes.STRING
  }, {
    classMethods: {
      findAllByPostbackValue: (postback) => {
        return Text.findAll({
          include: [
            {
              model: QuickReplies
            },
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
