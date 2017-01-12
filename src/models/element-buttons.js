export default (sequelize, DataTypes) => {
  const ElementButton = sequelize.define('ElementButtons', {}, {
    timestamps: false,
  });
  return ElementButton;
};
