export default (sequelize, DataTypes) => {
  const ElementButton = sequelize.define('ElementButtons', {
    order: DataTypes.INTEGER
  }, {
    timestamps: false,
  });
  return ElementButton;
};
