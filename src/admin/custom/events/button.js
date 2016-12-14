export default class ButtonEvent {
  preSave(req, res, args, next) {
    const record = args.data.view[args.name].records[0].columns;

    if (args.action == 'insert') {
      record.typeValue = 'postback';
    }
    next();
  };
};
