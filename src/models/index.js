import Sequelize from 'sequelize';

import UserDefinition from './user';

import GroupDefinition from './group';
import BlockDefinition from './block';
import GalleryDefinition from './gallery';
import ElementDefinition from './element';
import TextCardDefinition from './textcard';
import ImageDefinition from './image';
import QuickReplyDefinition from './quick-reply';
import ItemDefinition from './item';
import ButtonDefinition from './button';
import UserVariableDefinition from './user-variable';
import TarotCardDefinition from './tarot-card';
import OpenedCardDefinition from './opened-card';

import ElementButtonDefinition from './element-buttons';
import TextCardButtonDefinition from './textcard-buttons';

const sequelize = new Sequelize(process.env.NODE_ENV !== 'test' ? process.env.DB_URL : process.env.DB_URL_TEST);

const User = sequelize.import('Users', UserDefinition);
const Group = sequelize.import('Groups', GroupDefinition);
const Block = sequelize.import('Blocks', BlockDefinition);
const Gallery = sequelize.import('Galleries', GalleryDefinition);
const Element = sequelize.import('Elements', ElementDefinition);
const TextCard = sequelize.import('TextCards', TextCardDefinition);
const Image = sequelize.import('Images', ImageDefinition);
const QuickReply = sequelize.import('QuickReplies', QuickReplyDefinition);
const Item = sequelize.import('Items', ItemDefinition);
const Button = sequelize.import('Buttons', ButtonDefinition);
const UserVariable = sequelize.import('UserVariables', UserVariableDefinition);
const TarotCard = sequelize.import('TarotCards', TarotCardDefinition);
const OpenedCard = sequelize.import('OpenedCards', OpenedCardDefinition);

const ElementButton = sequelize.import('ElementButtons', ElementButtonDefinition);
const TextCardButton = sequelize.import('TextCardButtons', TextCardButtonDefinition);


//Group 1 - n Block
Group.hasMany(Block, { foreignKey: 'groupId' });
Block.belongsTo(Group, { as: 'Group', foreignKey: 'groupId' });

//Block 1 - n Gallery
Block.hasMany(Gallery, { foreignKey: 'blockId' });
Gallery.belongsTo(Block, { as: 'Block', foreignKey: 'blockId' });

//Block 1 - n TextCard
Block.hasMany(TextCard, { foreignKey: 'blockId' });
TextCard.belongsTo(Block, { as: 'Block', foreignKey: 'blockId' });

//Block 1 - n Image
Block.hasMany(Image, { foreignKey: 'blockId' });
Image.belongsTo(Block, { as: 'Block', foreignKey: 'blockId' });

//Block 1 - n QuickReply
Block.hasMany(QuickReply, { foreignKey: 'blockId' });
QuickReply.belongsTo(Block, { as: 'Block', foreignKey: 'blockId' });

//QuickReply 1 - n Item
QuickReply.hasMany(Item, { foreignKey: 'quickReplyId' });
Item.belongsTo(QuickReply, { as: 'QuickReply', foreignKey: 'quickReplyId' });

//Gallery 1 - n Element
Gallery.hasMany(Element, { foreignKey: 'galleryId' });
Element.belongsTo(Gallery, { as: 'Gallery', foreignKey: 'galleryId' });

//Element n - 0..3 Button
Element.belongsToMany(Button, { through: { model: ElementButton }, foreignKey: 'elementId' });
Button.belongsToMany(Element, { through: { model: ElementButton }, foreignKey: 'buttonId' });

//TextCard 1 - 0..3 Button
TextCard.belongsToMany(Button, { through: { model: TextCardButton }, foreignKey: 'textCardId' });
Button.belongsToMany(TextCard, { through: { model: TextCardButton }, foreignKey: 'buttonId' });

//QuickReply 1 - 1 UserVariable
QuickReply.belongsTo(UserVariable, { as: 'UserVariable', foreignKey: 'userVariableId' });

//Button 1 - 1 Block
Button.belongsTo(Block, { as: 'Block', foreignKey: 'blockId' });

//Block 1 - n TarotCard
Block.hasMany(TarotCard, { foreignKey: 'blockId' });
TextCard.belongsTo(Block, { as: 'Blocks', foreignKey: 'blockId' });

//TarotCard 1 - n TextCard
TarotCard.hasMany(TextCard, { foreignKey: 'tarotCardId' });
TextCard.belongsTo(TarotCard, { as: 'TarotCard', foreignKey: 'tarotCardId' });

//TarotCard 1 - n Image
TarotCard.hasMany(Image, { foreignKey: 'tarotCardId' });
Image.belongsTo(TarotCard, { as: 'TarotCard', foreignKey: 'tarotCardId' });


//User 1 - n OpenedCard
User.hasMany(OpenedCard, { foreignKey: 'userId' });
OpenedCard.belongsTo(User, { as: 'User', foreignKey: 'userId' });

//OpenedCard 1 - 1 TarotCard
OpenedCard.belongsTo(TarotCard, { as: 'TarotCard', foreignKey: 'tarotCardId' });

export {
  sequelize,
  User,
  Group,
  Block,
  Gallery,
  Element,
  TextCard,
  Image,
  QuickReply,
  Item,
  Button,
  UserVariable,
  TextCardButton,
  ElementButton,
  TarotCard,
  OpenedCard
}
