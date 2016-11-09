import {GET_STARTED_PAYLOAD} from 'utils/constants';

export const isGetStartedResponse = function (responseMessage) {
  return responseMessage && responseMessage.payload === GET_STARTED_PAYLOAD;
};


