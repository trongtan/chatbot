import Promise from 'promise';
import co from 'co';

import Models from 'models';
import { logger } from 'logs/winston-logger';

export const analyzeAskingDisease = messageEvent => {
  if (!(messageEvent && messageEvent.message && messageEvent.message.text)) {
    return Promise.resolve({ isAskingDisease: false });
  }

  const text = messageEvent.message.text;
  return _getRequest(text).then((res) => {
    if (res.requestedTypes.length > 0 && res.requestedDiseases.length > 0) {
      return Promise.resolve({ isAskingDisease: true, types: res.requestedTypes, diseases: res.requestedDiseases });
    } else {
      return Promise.resolve({ isAskingDisease: false });
    }
  });
};

const _getRequest = (message) => {

  logger.log('info', 'Message: %j', message);

  return co(function *() {
    const typeSynonyms = yield Models.TypeSynonym.findAllTypeSynonyms();
    const diseaseSynonyms = yield Models.DiseaseSynonym.findAllDiseaseSynonyms();

    logger.log('info', 'List of typeSynonyms: %j', typeSynonyms);
    logger.log('info', 'List of diseaseSynonyms: %j', diseaseSynonyms);

    const requestedTypeSynonyms = typeSynonyms.filter(typeSynonym => {
      return message.indexOf(typeSynonym.value) !== -1;
    });

    const requestedDiseaseSynonyms = diseaseSynonyms.filter(diseaseSynonym => {
      return message.indexOf(diseaseSynonym.name) !== -1;
    });

    logger.log('info', 'List of requestedTypeSynonyms: %j', requestedTypeSynonyms);
    logger.log('info', 'List of requestedDiseaseSynonyms: %j', requestedDiseaseSynonyms);

    const requestedTypeIds = requestedTypeSynonyms.map(requestedTypeSynonym => {
      return requestedTypeSynonym.get('typeId');
    });

    const requestedDiseaseIds = requestedDiseaseSynonyms.map(requestedDiseaseSynonym => {
      return requestedDiseaseSynonym.get('diseaseId');
    });

    logger.log('info', 'List of requestedTypeIds: %j', requestedTypeIds);
    logger.log('info', 'List of requestedDiseaseIds: %j', requestedDiseaseIds);

    const requestedTypes = yield Models.Type.findTypesByIds(requestedTypeIds);
    const requestedDiseases = yield Models.Disease.findDiseasesByIds(requestedDiseaseIds);

    logger.log('info', 'List of requestedTypes: %j', requestedTypes);
    logger.log('info', 'List of requestedDiseases: %j', requestedDiseases);

    return { requestedTypes, requestedDiseases };
  });
};
