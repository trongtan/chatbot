import MessageProducer from './message-producer';
import MessageTemplate from './message-template';
import MessageRSS from './message-rss';

export default class MessageProducerFactory {
  build() {
    const messageTemplate = new MessageTemplate();
    const messageRSS = new MessageRSS();
    return new MessageProducer(messageTemplate, messageRSS);
  }
}
