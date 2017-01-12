export default (sequelize, DataTypes) => {
  const GalleryButtons = sequelize.define('GalleryButtons', {}, {
    timestamps: false,
  });
  return GalleryButtons;
};
