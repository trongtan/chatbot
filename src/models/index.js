import Sequelize from 'sequelize';

import UserDefinition from './user';

import GroupDefinition from './group';
import BlockDefinition from './block';
import GalleryDefinition from './gallery';
import TextCardDefinition from './text-card';
import ImageDefinition from './image';
import QuickReplyDefinition from './quick-reply';
import ButtonDefinition from './button';
import UserVariableDefinition from './user-variable';

const sequelize = new Sequelize(process.env.NODE_ENV !== 'test' ? process.env.DB_URL : process.env.DB_URL_TEST);

const User = sequelize.import('User', UserDefinition);
const Group = sequelize.import('Group', GroupDefinition);
const Block = sequelize.import('Block', BlockDefinition);
const Gallery = sequelize.import('Gallery', GalleryDefinition);
const TextCard = sequelize.import('TextCard', TextCardDefinition);
const Image = sequelize.import('Image', ImageDefinition);
const QuickReply = sequelize.import('QuickReply', QuickReplyDefinition);
const Button = sequelize.import('Button', ButtonDefinition);
const UserVariable = sequelize.import('UserVariable', UserVariableDefinition);

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

//Gallery 1 - 0..3 Button
Gallery.hasMany(Button, { foreignKey: 'galleryId' });
Button.belongsTo(Gallery, { as: 'Gallery', foreignKey: 'galleryId' });

//TextCard 1 - 0..3 Button
TextCard.hasMany(Button, { foreignKey: 'textCardId' });
Button.belongsTo(TextCard, { as: 'Gallery', foreignKey: 'textCardId' });

//QuickReply 1 - 1 UserVariable
QuickReply.belongsTo(UserVariable, { as: 'UserVariable', foreignKey: 'userVariableId' });

export {
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
