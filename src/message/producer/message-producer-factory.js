import MessageProducer from './message-producer';
import MessageTemplate from './message-builder';

export default class MessageProducerFactory {
  build() {
    const messageBuilder = new MessageTemplate();
    return new MessageProducer(messageBuilder);
  }
}
