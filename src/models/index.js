import Sequelize from 'sequelize';

import UserDefinition from './user';
import QuickReplyDefinition from './quick-reply';

import WatchwordDefinition from './watchword';
import SynonymDefinition from './synonym';
import PostbackDefinition from './postback';
import TextDefinition from './text';
import MessageDefinition from './message';
import TextMessageDefinition from './text-message';
import TextQuickReplyDefinition from './text-quick-reply';
import ElementDefinition from './element';
import ButtonDefinition from './button';
import ButtonTypeDefinition from './button-type';
import ElementButtonDefinition from './element-button';
import ButtonTemplateDefinition from './button-template';
import ButtonTemplateButtonDefinition from './button-template-button';
import ButtonTemplateMessageDefinition from './button-template-message';

const sequelize = new Sequelize(process.env.NODE_ENV !== 'test' ? process.env.DB_URL : process.env.DB_URL_TEST);

const User = sequelize.import('User', UserDefinition);
const Watchword = sequelize.import('Watchword', WatchwordDefinition);
const Synonym = sequelize.import('Synonym', SynonymDefinition);
const Postback = sequelize.import('Postback', PostbackDefinition);
const Texts = sequelize.import('Texts', TextDefinition);
const Messages = sequelize.import('Messages', MessageDefinition);
const TextMessages = sequelize.import('TextMessages', TextMessageDefinition);
const QuickReplies = sequelize.import('QuickReply', QuickReplyDefinition);
const TextQuickReplies = sequelize.import('TextQuickReply', TextQuickReplyDefinition);
const Elements = sequelize.import('Element', ElementDefinition);
const Buttons = sequelize.import('Button', ButtonDefinition);
const ButtonTypes = sequelize.import('ButtonType', ButtonTypeDefinition);
const ElementButtons = sequelize.import('ElementButton', ElementButtonDefinition);
const ButtonTemplates = sequelize.import('ButtonTemplate', ButtonTemplateDefinition);
const ButtonTemplateButtons = sequelize.import('ButtonTemplateButton', ButtonTemplateButtonDefinition);
const ButtonTemplateMessages = sequelize.import('ButtonTemplateMessage', ButtonTemplateMessageDefinition);

Postback.hasMany(Watchword, {foreignKey: 'postbackId'});
Watchword.belongsTo(Postback, {as: 'Postback', foreignKey: 'postbackId'});

//Watchword 1 - n Synonym
Watchword.hasMany(Synonym, {foreignKey: 'watchwordId'});
Synonym.belongsTo(Watchword, {as: 'Watchwords', foreignKey: 'watchwordId'});

//Texts n - m Messages
Texts.belongsToMany(Messages, {through: {model: TextMessages}, foreignKey: 'textId'});
Messages.belongsToMany(Texts, {through: {model: TextMessages}, foreignKey: 'messageId'});

//Texts 1 - 1 Postback
Texts.belongsTo(Postback, {as: 'Postback', foreignKey: 'postbackId'});

QuickReplies.belongsTo(Postback, {as: 'Postback', foreignKey: 'postbackId'});

//Texts n-m QuickReply
Texts.belongsToMany(QuickReplies, {through: {model: TextQuickReplies}, foreignKey: 'textId'});
QuickReplies.belongsToMany(Texts, {through: {model: TextQuickReplies}, foreignKey: 'quickReplyId'});

//Element 1 - 1 Postback
Elements.belongsTo(Postback, {as: 'Postback', foreignKey: 'postbackId'});

//Button 1 - n ButtonType
ButtonTypes.hasMany(Buttons, {foreignKey: 'buttonTypeId'});
Buttons.belongsTo(ButtonTypes, {as: 'ButtonTypes', foreignKey: 'buttonTypeId'});

ButtonTypes.hasMany(Buttons, {foreignKey: 'buttonTypeId'});

//Button 1 - 1 Postback
Buttons.belongsTo(Postback, {as: 'Postback', foreignKey: 'postbackId'});

//Element n-m Button
Elements.belongsToMany(Buttons, {through: {model: ElementButtons}, foreignKey: 'elementId'});
Buttons.belongsToMany(Elements, {through: {model: ElementButtons}, foreignKey: 'buttonId'});

//ButtonTemplate 1 - 1 Postback
ButtonTemplates.belongsTo(Postback, {as: 'Postback', foreignKey: 'postbackId'});

//ButtonTemplate n - m Button
ButtonTemplates.belongsToMany(Buttons, {through: {model: ButtonTemplateButtons}, foreignKey: 'buttonTemplateId'});
Buttons.belongsToMany(ButtonTemplates, {through: {model: ButtonTemplateButtons}, foreignKey: 'buttonId'});

//ButtonTemplate n - m Message
ButtonTemplates.belongsToMany(Messages, {through: {model: ButtonTemplateMessages}, foreignKey: 'buttonTemplateId'});
Messages.belongsToMany(ButtonTemplates, {through: {model: ButtonTemplateMessages}, foreignKey: 'messageId'});

export {
  User,
  QuickReplies,
  Synonym,
  Watchword,
  Postback,
  Texts,
  Messages,
  TextMessages,
  Elements,
  Buttons,
  ButtonTypes,
  ButtonTemplates
}
