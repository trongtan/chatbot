import EventEmitter from 'events';
import co from 'co';

import { Conversations } from 'models'
import { FINISHED_BUILD_MESSAGE, BUILD_CONVERSATION_MESSAGE } from 'utils/event-constants';

import { logger } from 'logs/winston-logger';

export default class ConversationProducer extends EventEmitter {
  constructor(messageTemplate) {
    super();
    this.messageTemplate = messageTemplate;
    this._listenEvent();
  }

  _listenEvent() {
    this.on(BUILD_CONVERSATION_MESSAGE, (user, payloads) => {
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT]: %s', JSON.stringify(payloads));
      this._buildMessageFromPayloads(user, payloads);
    });

    this.messageTemplate.on(FINISHED_BUILD_MESSAGE, message => {
      logger.info('[Message Producer] [FINISHED_BUILD_MESSAGE]: %s', JSON.stringify(message));
      this.emit(FINISHED_BUILD_MESSAGE, message);
    });
  }

  _buildMessageFromPayloads(user, payloads) {
    const self = this;
    return co(function *() {
      let conversationId = user.conversationId ? user.conversationId : '1';
      let chatStep = user.chatStep ? user.chatStep : 1;

      const chatMessages = yield Conversations.findConversationDialog(conversationId, chatStep);
      logger.info('[ConversationProducer][BUILD_CONVERSATION_MESSAGE] %s', JSON.stringify(chatMessages));
      if (chatMessages) {
        return self.messageTemplate.emit(BUILD_CONVERSATION_MESSAGE, user, chatMessages);
      }
    });
  }
}
