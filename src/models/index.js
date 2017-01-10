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
