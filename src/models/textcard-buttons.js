export default (sequelize, DataTypes) => {
  const TextCardButtons = sequelize.define('TextCardButtons', {
    order: DataTypes.INTEGER
  }, {
    timestamps: false
  });
  return TextCardButtons;
};
