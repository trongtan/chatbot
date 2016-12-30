import { Types } from 'models';

export default (sequelize, DataTypes) => {
  const Postback = sequelize.define('Postback', {
    title: DataTypes.STRING,
    value: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    freezeTableName: true,
    classMethods: {
      getAllPostbackFromValues: (values) => {
        return Postback.findAll({
          include: [{model: Types, as: 'Types'}],
          where: {
            value: {
              $in: values
            }
          }
        })
      }
    }
  });
  return Postback;
};
