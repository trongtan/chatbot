import Sequelize from 'sequelize';

import DiseaseDefinition from './disease';
import DiseaseSymptomDefinition from './disease-symptom';
import DiseaseSynonymDefinition from './disease-synonym';
import SymptomDefinition from './symptom';
import SymptomSynonymDefinition from './symptom-synonym';
import TypeDefinition from './type';
import TypeDiseaseDefinition from './type-disease';
import TypeSynonymDefinition from './type-synonym';
import LinkDefinition from './link';
import TypeDiseaseLinkDefinition from './type-disease-link';
import UserDefinition from './user';

const sequelize = new Sequelize(process.env.NODE_ENV !== 'test' ? process.env.DB_URL : process.env.DB_URL_TEST);

const Disease = sequelize.import('Disease', DiseaseDefinition);
const DiseaseSymptom = sequelize.import('DiseaseSymptom', DiseaseSymptomDefinition);
const DiseaseSynonym = sequelize.import('DiseaseSynonym', DiseaseSynonymDefinition);
const Symptom = sequelize.import('Symptom', SymptomDefinition);
const SymptomSynonym = sequelize.import('SymptomSynonym', SymptomSynonymDefinition);
const Type = sequelize.import('Type', TypeDefinition);
const TypeDisease = sequelize.import('TypeDisease', TypeDiseaseDefinition);
const TypeSynonym = sequelize.import('TypeSynonym', TypeSynonymDefinition);
const User = sequelize.import('User', UserDefinition);
const TypeDiseaseLink = sequelize.import('TypeDiseaseLink', TypeDiseaseLinkDefinition);
const Link = sequelize.import('Link', LinkDefinition);

// Disease <---m---|---n---> Symptom
Disease.belongsToMany(Symptom, { through: { model: DiseaseSymptom }, foreignKey: 'diseaseId', as: 'symptoms' });
Symptom.belongsToMany(Disease, { through: { model: DiseaseSymptom }, foreignKey: 'symptomId', as: 'diseases' });

// Disease <---1---|---n---> DiseaseSynonym
Disease.hasMany(DiseaseSynonym, { foreignKey: 'diseaseId' });

// Disease <---m---|---n---> Type
Disease.belongsToMany(Type, { through: { model: TypeDisease }, foreignKey: 'diseaseId' });
Type.belongsToMany(Disease, { through: { model: TypeDisease }, foreignKey: 'typeId' });

// Symptom <---1---|---n---> SymptomSynonym
Symptom.hasMany(SymptomSynonym, { foreignKey: 'symptomId', as: 'synonyms' });

// Type <---1---|---n---> TypeSynonym
Type.hasMany(TypeSynonym, { foreignKey: 'typeId' });


// TypeDisease <---m---|---n---> Link
TypeDisease.belongsToMany(Link, { through: { model: TypeDiseaseLink }, foreignKey: 'typeDiseaseId' });
Link.belongsToMany(TypeDisease, { through: { model: TypeDiseaseLink }, foreignKey: 'linkId' });

export { Disease, DiseaseSynonym, Symptom, SymptomSynonym, Type, TypeDisease, TypeSynonym, User, Link, TypeDiseaseLink }
