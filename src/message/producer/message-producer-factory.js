import MessageProducer from './message-producer';
import MessageTemplate from './message-template';

export default class MessageProducerFactory {
  build() {
    const messageTemplate = new MessageTemplate();
    return new MessageProducer(messageTemplate);
  }
}
