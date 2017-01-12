import Sequelize from 'sequelize';

import UserDefinition from './user';

import GroupDefinition from './group';
import BlockDefinition from './block';
import GalleryDefinition from './gallery';
import TextCardDefinition from './textcard';
import ImageDefinition from './image';
import QuickReplyDefinition from './quick-reply';
import ButtonDefinition from './button';
import UserVariableDefinition from './user-variable';

import GalleryButtonDefinition from './gallery-buttons';
import TextCardButtonDefinition from './textcard-buttons';

const sequelize = new Sequelize(process.env.NODE_ENV !== 'test' ? process.env.DB_URL : process.env.DB_URL_TEST);

const User = sequelize.import('Users', UserDefinition);
const Group = sequelize.import('Groups', GroupDefinition);
const Block = sequelize.import('Blocks', BlockDefinition);
const Gallery = sequelize.import('Galleries', GalleryDefinition);
const TextCard = sequelize.import('TextCards', TextCardDefinition);
const Image = sequelize.import('Images', ImageDefinition);
const QuickReply = sequelize.import('QuickReplies', QuickReplyDefinition);
const Button = sequelize.import('Buttons', ButtonDefinition);
const UserVariable = sequelize.import('UserVariables', UserVariableDefinition);

const GalleryButton = sequelize.import('GalleryButtons', GalleryButtonDefinition);
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

//Gallery n - 0..3 Button
Gallery.belongsToMany(Button, {through: {model: GalleryButton}, foreignKey: 'galleryId'});
Button.belongsToMany(Gallery, {through: {model: GalleryButton}, foreignKey: 'buttonId'});

//TextCard 1 - 0..3 Button
TextCard.belongsToMany(Button, {through: {model: TextCardButton}, foreignKey: 'textCardId'});
Button.belongsToMany(TextCard, {through: {model: TextCardButton}, foreignKey: 'buttonId'});

//QuickReply 1 - 1 UserVariable
QuickReply.belongsTo(UserVariable, { as: 'UserVariable', foreignKey: 'userVariableId' });

//Button 1 - 1 Block
Button.belongsTo(Block, { as: 'Block', foreignKey: 'blockId' });

export {
  sequelize,
  User,
  Group,
  Block,
  Gallery,
  TextCard,
  Image,
  QuickReply,
  Button,
  UserVariable
}
