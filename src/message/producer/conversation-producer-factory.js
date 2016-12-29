import ConversationProducer from './conversation-producer';
import MessageTemplate from './message-template';

export default class ConversationProducerFactory {
  build() {
    return new ConversationProducer(new MessageTemplate());
  }
}
