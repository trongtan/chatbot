import EventEmitter from 'events';
import co from 'co';
import async from 'async';

import { filter, map } from 'lodash';

import { Texts, Elements, ButtonTemplates, Diseases, Postback } from 'models';

import { BUILD_MESSAGE_EVENT, FINISHED_BUILD_MESSAGE } from 'utils/event-constants';
import {
  BUILD_TEXT_MESSAGE,
  BUILD_GENERIC_MESSAGE,
  BUILD_BUTTON_TEMPLATE_MESSAGE,
  BUILD_DISEASE_TEMPLATE_MESSAGE
} from 'utils/event-constants';

import { GENERAL_TYPE, INFORMATION_PREVENTION_TREATMENT_TYPE, DISEASE_TYPE } from 'utils/constants';

import { logger } from 'logs/winston-logger';

export default class MessageProducer extends EventEmitter {
  constructor(messageTemplate) {
    super();
    this.messageTemplate = messageTemplate;
    this._listenEvent();
  }

  _listenEvent() {
    this.on(BUILD_MESSAGE_EVENT, (user, payloads) => {
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT]: %s', JSON.stringify(payloads));

      this._buildMessageFromPayloads(user, payloads);
    });

    this.messageTemplate.on(FINISHED_BUILD_MESSAGE, message => {
      logger.info('[Message Producer] [FINISHED_BUILD_MESSAGE]: %s', JSON.stringify(message));
      this.emit(FINISHED_BUILD_MESSAGE, message);
    });
  }

  _filterRequestingPayloads(payloads) {
    return co(function *() {
      let returnedPayloads = [];
      const postbacks = yield Postback.getAllPostbackFromValues(payloads);

      const generalPayloads = filter(postbacks, (postback) => {
        return postback.Types.priority == GENERAL_TYPE;
      });

      const infoPreventTreatmentPayloads = filter(postbacks, (postback) => {
        return postback.Types.priority == INFORMATION_PREVENTION_TREATMENT_TYPE;
      });

      const diseasePayloads = filter(postbacks, (postback) => {
        return postback.Types.priority == DISEASE_TYPE;
      });

      if (infoPreventTreatmentPayloads.length == 0 && diseasePayloads.length == 0 && generalPayloads.length > 0) {
        returnedPayloads.push(generalPayloads);
      } else if (infoPreventTreatmentPayloads.length > 0 && diseasePayloads.length > 0) {
        infoPreventTreatmentPayloads.forEach(infoPreventTreatmentPayload => {
          diseasePayloads.forEach(diseasePayload => {
            returnedPayloads.push([infoPreventTreatmentPayload, diseasePayload]);
          });
        });

      }
      return returnedPayloads;
    });
  }

  _getMessageTemplateFromDatabase(user, payloads) {
    const self = this;
    return co(function *() {
      //FIXME: We temporary handle first payload here.
      const firstPayload = payloads[0];
      const secondPayload = payloads[1];

      const templateMessages = yield Texts.findAllByPostbackValue(firstPayload);
      const elementMessages = yield Elements.findAllByPostbackValue(firstPayload);
      const buttonTemplateMessages = yield ButtonTemplates.findAllByPostbackValue(firstPayload);
      const diseaseMessages = yield Diseases.findAllByPostbackValue(firstPayload, secondPayload);

      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][templateMessages]: %s', JSON.stringify(templateMessages));
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][elementMessages]: %s', JSON.stringify(elementMessages));
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][buttonTemplateMessages]: %s', JSON.stringify(buttonTemplateMessages));
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][diseaseMessages]: %s', JSON.stringify(diseaseMessages));

      if (templateMessages.length > 0) {
        return self.messageTemplate.emit(BUILD_TEXT_MESSAGE, user, templateMessages);
      } else if (elementMessages.length > 0) {
        return self.messageTemplate.emit(BUILD_GENERIC_MESSAGE, user, elementMessages);
      } else if (buttonTemplateMessages.length > 0) {
        return self.messageTemplate.emit(BUILD_BUTTON_TEMPLATE_MESSAGE, user, buttonTemplateMessages);
      } else if (diseaseMessages.length > 0) {
        return self.messageTemplate.emit(BUILD_DISEASE_TEMPLATE_MESSAGE, user, diseaseMessages);
      }
    });
  }

  _buildMessageFromPayloads(user, payloads) {
    const self = this;
    return co(function *() {
      const requestingPayloads = yield self._filterRequestingPayloads(payloads);
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][Requesting Payload]: %s', JSON.stringify(requestingPayloads));

      return async.eachSeries(requestingPayloads, (requestingPayload, next) => {
        const payloads = map(requestingPayload, (payloads) => {
          return payloads.value
        });

        logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][Requesting Payload]: %s', JSON.stringify(payloads));

        return self._getMessageTemplateFromDatabase(user, payloads).then(result => {
          logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][Requesting Payload][Result]: %s', JSON.stringify(result));
          if (result) {
            next();
          }
        });
      });
    });
  }
}
