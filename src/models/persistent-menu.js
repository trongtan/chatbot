import { map } from 'lodash';
import { Postback } from 'models';

export default (sequelize, DataTypes) => {
  const PersistentMenu = sequelize.define('PersistentMenu', {
    title: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    classMethods: {
      findAllPersistentMenu: () => {
        return PersistentMenu.findAll({
          include: [{
            model: Postback,
            as: 'Postback'
          }]
        }).then(menus => {
          return map(menus, menu => {
            return { type: menu.type, title: menu.title, payload: menu.Postback.value }
          });
        });
      }
    }
  });
  return PersistentMenu;
};
