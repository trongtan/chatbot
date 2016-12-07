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
import ButtonDefinition from './button';

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
const Button = sequelize.import('Button', ButtonDefinition);


TypeDisease.belongsToMany(Link, { through: { model: TypeDiseaseLink }, foreignKey: 'typeDiseaseId' });
Link.belongsToMany(TypeDisease, { through: { model: TypeDiseaseLink }, foreignKey: 'linkId' });

GroupMessage.belongsTo(Group);
Keyword.belongsTo(Group);
Button.belongsTo(Group);

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
  Button
}
