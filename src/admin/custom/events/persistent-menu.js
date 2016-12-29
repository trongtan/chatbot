import { get } from 'lodash';
import { updatePersistentMenu } from 'utils/service-utils';
import { PersistentMenus } from 'models'

export default class PersistentMenusEvent {
  preSave(req, res, args, next) {
    next();
  };

  postSave(req, res, args, next) {
    PersistentMenus.findAllPersistentMenu().then(persistentMenus => {
      console.log('persistentMenus: %s', JSON.stringify(persistentMenus));
      updatePersistentMenu(persistentMenus);
    });
    next();
  };
};
