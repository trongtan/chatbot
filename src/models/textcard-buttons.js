export default (sequelize, DataTypes) => {
  const TextCardButtons = sequelize.define('TextCardButtons', {}, {
    timestamps: false
  });
  return TextCardButtons;
};
