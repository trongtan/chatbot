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

TypeDisease.belongsToMany(Link, { through: { model: TypeDiseaseLink }, foreignKey: 'typeDiseaseId' });
Link.belongsToMany(TypeDisease, { through: { model: TypeDiseaseLink }, foreignKey: 'linkId' });

export {
  sequelize,
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
  RegionalMenuItem
}
