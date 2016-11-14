import Sequelize from 'sequelize';

import DiseaseDefinition from './disease';
import DiseaseSymptomDefinition from './disease-synonym';
import SymptomDefinition from './symptom';
import SymptomSynonymDefinition from './symptom-synonym';
import TypeDefinition from './type';
import TypeDiseaseDefinition from './type-disease';
import TypeSynonymDefinition from './type-synonym';
import UserDefinition from './user';


const sequelize = new Sequelize("postgres://postgres@localhost:5432/life_pedia_development", {
  define: {
    freezeTableName: true
  }
});

const Disease = sequelize.import('Disease', DiseaseDefinition);
const DiseaseSymptom = sequelize.import('DiseaseSymptom', DiseaseSymptomDefinition);
const Symptom = sequelize.import('Symptom', SymptomDefinition);
const SymptomSynonym = sequelize.import('SymptomSynonym', SymptomSynonymDefinition);
const Type = sequelize.import('Type', TypeDefinition);
const TypeDisease = sequelize.import('TypeDisease', TypeDiseaseDefinition);
const TypeSynonym = sequelize.import('TypeSynonym', TypeSynonymDefinition);
const User = sequelize.import('User', UserDefinition);

export { Disease, DiseaseSymptom, Symptom, SymptomSynonym, Type, TypeDisease, TypeSynonym, User }
