import Sequelize from 'sequelize';

import DiseaseDefinition from './disease';
import DiseaseSynonymDefinition from './disease-synonym';
import SymptomDefinition from './symptom';
import SymptomSynonymDefinition from './symptom-synonym';
import TypeDefinition from './type';
import TypeDiseaseDefinition from './type-disease';
import TypeSynonymDefinition from './type-synonym';
import LinkDefinition from './link';
import TypeDiseaseLinkDefinition from './type-disease-link';
import UserDefinition from './user';
import KeywordDefinition from './keyword';
import RegionalMenuItemDefinition from './regional-menu-item';
import GroupDefinition from './group';
import GroupMessageDefinition from './group-message';
import QuickReplyDefinition from './quick-reply';
import TypeMessageDefinition from './type-message';

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

const sequelize = new Sequelize(process.env.NODE_ENV !== 'test' ? process.env.DB_URL : process.env.DB_URL_TEST);

const Disease = sequelize.import('Disease', DiseaseDefinition);
const DiseaseSynonym = sequelize.import('DiseaseSymptom', DiseaseSynonymDefinition);
const Symptom = sequelize.import('Symptom', SymptomDefinition);
const SymptomSynonym = sequelize.import('SymptomSynonym', SymptomSynonymDefinition);
const Type = sequelize.import('Type', TypeDefinition);
const TypeDisease = sequelize.import('TypeDisease', TypeDiseaseDefinition);
const TypeSynonym = sequelize.import('TypeSynonym', TypeSynonymDefinition);
const User = sequelize.import('User', UserDefinition);
const TypeDiseaseLink = sequelize.import('TypeDiseaseLink', TypeDiseaseLinkDefinition);
const Link = sequelize.import('Link', LinkDefinition);
const Keyword = sequelize.import('Keyword', KeywordDefinition);
const RegionalMenuItem = sequelize.import('RegionalMenuItem', RegionalMenuItemDefinition);
const Group = sequelize.import('Group', GroupDefinition);
const GroupMessage = sequelize.import('GroupMessage', GroupMessageDefinition);
const TypeMessage = sequelize.import('TypeMessage', TypeMessageDefinition);

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

TypeDisease.belongsToMany(Link, { through: { model: TypeDiseaseLink }, foreignKey: 'typeDiseaseId' });
Link.belongsToMany(TypeDisease, { through: { model: TypeDiseaseLink }, foreignKey: 'linkId' });

GroupMessage.belongsTo(Group, { as: 'Groups', foreignKey: 'groupId' });
Group.hasMany(GroupMessage, { foreignKey: 'groupId' });

Keyword.belongsTo(Group, { as: 'Groups', foreignKey: 'groupId' });
Group.hasMany(Keyword, { foreignKey: 'groupId' });

TypeMessage.belongsTo(Type, { as: 'Types', foreignKey: 'typeId' });
Type.hasMany(TypeMessage, { foreignKey: 'typeId' });

Postback.hasMany(Watchword, { foreignKey: 'postbackId' });
Watchword.belongsTo(Postback, { as: 'Postback', foreignKey: 'postbackId' });

//Watchword 1 - n Synonym
Watchword.hasMany(Synonym, { foreignKey: 'watchwordId' });
Synonym.belongsTo(Watchword, { as: 'Watchwords', foreignKey: 'watchwordId' });

//Texts n - m Messages
Texts.belongsToMany(Messages, { through: { model: TextMessages }, foreignKey: 'textId' });
Messages.belongsToMany(Texts, { through: { model: TextMessages }, foreignKey: 'messageId' });

//Texts 1 - 1 Postback
Texts.belongsTo(Postback, { as: 'Postback', foreignKey: 'postbackId' });

QuickReplies.belongsTo(Postback, { as: 'Postback', foreignKey: 'postbackId' });

//Texts n-m QuickReply
Texts.belongsToMany(QuickReplies, { through: { model: TextQuickReplies }, foreignKey: 'textId' });
QuickReplies.belongsToMany(Texts, { through: { model: TextQuickReplies }, foreignKey: 'quickReplyId' });

//Element 1 - 1 Postback
Elements.belongsTo(Postback, { as: 'Postback', foreignKey: 'postbackId' });

//Button 1 - n ButtonType
ButtonTypes.hasMany(Buttons, { foreignKey: 'buttonTypeId' });
Buttons.belongsTo(ButtonTypes, { as: 'ButtonTypes', foreignKey: 'buttonTypeId' });

ButtonTypes.hasMany(Buttons, { foreignKey: 'buttonTypeId' });

//Button 1 - 1 Postback
Buttons.belongsTo(Postback, { as: 'Postback', foreignKey: 'postbackId' });

//Element n-m Button
Elements.belongsToMany(Buttons, { through: { model: ElementButtons }, foreignKey: 'elementId' });
Buttons.belongsToMany(Elements, { through: { model: ElementButtons }, foreignKey: 'buttonId' });

export {
  Disease,
  DiseaseSynonym,
  Symptom,
  SymptomSynonym,
  Type,
  TypeDisease,
  TypeSynonym,
  User,
  Link,
  TypeDiseaseLink,
  Keyword,
  RegionalMenuItem,
  Group,
  GroupMessage,
  QuickReplies,
  TypeMessage,
  Synonym,
  Watchword,
  Postback,
  Texts,
  Messages,
  TextMessages,
  Elements,
  Buttons,
  ButtonTypes
}
